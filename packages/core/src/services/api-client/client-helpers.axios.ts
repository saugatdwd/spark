import type { DefaultError, InfiniteData, QueryKey } from "@tanstack/query-core";
import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosResponse, type AxiosInstance, type AxiosRequestConfig } from "axios";
import _ from "lodash";

import { CurrentIdentity } from "../../models";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

type AxiosConfig = {
  endpointUrl: string;
  headers?: Record<string, string>;
  options?: AxiosRequestConfig;
  getIdentity?: () => CurrentIdentity;
  beforeRequest?: (token?: string) => Promise<void>;
};

export function createAxiosClient({
  endpointUrl,
  options = {},
  headers = DEFAULT_HEADERS,
  getIdentity,
  beforeRequest,
}: AxiosConfig): AxiosInstance {
  if (!axios) {
    throw new Error("`axios` is needed");
  }

  const axiosInstance = axios.create(
    _.merge(
      {
        baseURL: endpointUrl,
        headers: _.merge(
          {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          headers
        ),
      },
      options
    )
  );
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.code === "ERR_NETWORK") {
        error = { ...error, response: { data: { message: "No Internet. Please check your internet connection." } } };
      } else {
        const status = error.response?.status;
        let errorMessage = error.response?.data?.message;

        if (!errorMessage) {
          switch (status) {
            case 400:
              errorMessage = "Bad Request: Please check your input.";
              break;
            case 401:
              errorMessage = "Unauthorized: Please log in.";
              break;
            case 403:
              errorMessage = "Forbidden: You don't have permission.";
              break;
            case 404:
              errorMessage = "Not Found: The requested resource couldn't be found.";
              break;
            case 500:
              errorMessage = "Internal Server Error: Something went wrong on our side.";
              break;
            case 503:
              errorMessage = "Service Unavailable: Please try again later.";
              break;
            default:
              errorMessage = "An unknown error occurred. Please try again.";
              break;
          }
        }

        error.response.data.message = errorMessage;
      }

      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.request.use(async (request) => {
    const methods = ["post", "patch", "put"];

    const newToken =
      request?.method &&
      methods.includes(request?.method) &&
      (await beforeRequest?.(
        request.headers["Authorization"]
          ? (request.headers["Authorization"] as string | undefined)
          : "Bearer " + getIdentity?.()?.token
      ));

    request.headers["Authorization"] = newToken
      ? `Bearer ${newToken}`
      : request.headers["Authorization"]
        ? request.headers["Authorization"]
        : "Bearer " + getIdentity?.()?.token;

    return request;
  });

  return axiosInstance;
}

export function useSimpleQuery<TResult, TError = DefaultError, TQueryKey extends QueryKey = QueryKey>(
  client: AxiosInstance,
  query: AxiosRequestConfig | ((client: AxiosInstance) => Promise<TResult>),
  queryKey: TQueryKey = [] as never,
  {
    transformResponse,
    ...options
  }: Partial<
    UseQueryOptions<unknown, TError, TResult, TQueryKey> & { transformResponse?: (response: any) => TResult }
  > = {}
): UseQueryResult<TResult, TError> {
  return useQuery({
    queryKey: queryKey || [],
    queryFn: () => {
      if (typeof query === "function") {
        return query(client);
      }
      return client
        .request(query)
        .then((response) => (transformResponse ? transformResponse(response.data) : response.data));
    },
    ...options,
  });
}

export type InfiniteQueryOptions<
  TQueryFnData,
  TResult = InfiniteData<TQueryFnData>,
  TParams = any,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey,
> = Partial<UseInfiniteQueryOptions<TQueryFnData, TError, TResult, TResult, TQueryKey, TParams>> &
  Pick<
    UseInfiniteQueryOptions<TQueryFnData, TError, TResult, TResult, TQueryKey, TParams>,
    "getNextPageParam" | "getPreviousPageParam" | "initialPageParam"
  > & { transformResponse?: (response: any) => TResult };

export function useSimpleInfiniteQuery<
  TResult,
  TParams = never,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey,
>(
  client: AxiosInstance,
  query: AxiosRequestConfig | ((client: AxiosInstance, pageParam?: TParams) => Promise<TResult>),
  queryKey: TQueryKey = [] as never,
  { transformResponse, queryFn, ...options }: InfiniteQueryOptions<TResult, any, TParams, TError, TQueryKey>
): UseInfiniteQueryResult<InfiniteData<TResult, TParams>, TError> {
  return useInfiniteQuery({
    queryKey: queryKey || [],
    queryFn:
      typeof queryFn === "function"
        ? queryFn
        : ({ pageParam }) => {
            if (typeof query === "function") {
              return query(client, pageParam as never);
            }
            const config = {
              ...query,
              params: { ...query.params, ...(typeof pageParam === "object" ? pageParam : {}) },
            };
            return client
              .request(config)
              .then((response) => (transformResponse ? transformResponse(response.data) : response.data));
          },
    ...options,
  });
}

export function useSimpleMutation<TParams, TResult, TError = DefaultError>(
  client: AxiosInstance,
  query: (client: AxiosInstance, params: TParams) => Promise<AxiosResponse<TResult>>,
  options: UseMutationOptions<TResult, TError, TParams, unknown> = {}
): UseMutationResult<TResult, TError, TParams> {
  return useMutation({
    mutationFn: async (params) => {
      return query(client, params).then((response) => response?.data);
    },

    ...options,
  });
}
