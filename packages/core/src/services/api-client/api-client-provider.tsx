import type { DefaultError, InfiniteData, QueryKey } from "@tanstack/query-core";
import {
  QueryClient,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import React, { useContext, useMemo } from "react";

import {
  InfiniteQueryOptions,
  useSimpleInfiniteQuery,
  useSimpleMutation,
  useSimpleQuery,
} from "./client-helpers.axios";
import { localStoragePersister } from "./local-storage-persister";

export type ApiClientProviderType = {
  apiClient: AxiosInstance;
  getHeaders: () => Partial<Record<string, string>>;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: true,
    },
  },
});

export const ClientProviderContext = React.createContext<ApiClientProviderType>({} as never);

export interface ApiClientProviderProps<ApiClient extends AxiosInstance> {
  client: ApiClient;
  getHeaders?: (headers: Record<string, string>) => Partial<Record<string, string>>;
}

export function ApiClientProvider<ApiClient extends AxiosInstance>({
  client,
  children,
  getHeaders = (headers) => headers,
}: React.PropsWithChildren<ApiClientProviderProps<ApiClient>>) {
  const value = useMemo(
    () => ({
      apiClient: client,
      getHeaders: (headers = {}) => getHeaders(headers),
    }),
    [client, getHeaders]
  );

  return <ClientProviderContext.Provider value={value}>{children}</ClientProviderContext.Provider>;
}

export const useClientProvider = () => {
  const context = useContext(ClientProviderContext);

  if (context === undefined) {
    throw new Error("useClientProvider must be used within a ClientProviderContext");
  }

  if (context === null) {
    throw new Error("ClientProviderContext has not been initialized");
  }

  return context;
};

export interface EnhancedQueryOptions<TResult, TError = DefaultError, TQueryKey extends QueryKey = QueryKey>
  extends Partial<UseQueryOptions<unknown, TError, TResult, TQueryKey>> {
  persistanceOptions?: {
    maxAge?: number;
    enabled?: boolean;
  };
  transformResponse?: (response: any) => TResult;
}

export function useEnhancedQuery<TResult, TError = DefaultError, TQueryKey extends QueryKey = QueryKey>(
  query: AxiosRequestConfig | ((client: AxiosInstance) => Promise<TResult>),
  queryKey?: TQueryKey,
  options?: EnhancedQueryOptions<TResult, TError, TQueryKey>
): UseQueryResult<TResult, TError> {
  const { apiClient } = useClientProvider();

  const { persistanceOptions, ...restOptions } = options || {};

  return useSimpleQuery<TResult, TError, TQueryKey>(apiClient, query, queryKey, {
    ...restOptions,
    meta: persistanceOptions?.enabled ? { cacheLifeSpan: persistanceOptions?.maxAge } : options?.meta,
    persister: persistanceOptions?.enabled ? localStoragePersister : options?.persister,
  });
}

export function useEnhancedInfiniteQuery<
  TResult = any,
  TParams = never,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryKey,
  query,
  ...options
}: InfiniteQueryOptions<any, TResult, TParams, TError, TQueryKey> & {
  query?: AxiosRequestConfig | ((client: AxiosInstance, pageParam?: TParams) => Promise<TResult>);
}): UseInfiniteQueryResult<InfiniteData<TResult, TParams>, TError> {
  const { apiClient } = useClientProvider();

  return useSimpleInfiniteQuery<TResult, TParams, TError, TQueryKey>(apiClient, query ?? {}, queryKey, options);
}

export function useEnhancedMutations<TParams, TResult, TError = DefaultError>(
  query: (client: AxiosInstance, params: TParams) => Promise<AxiosResponse<TResult>>,
  options?: UseMutationOptions<TResult, TError, TParams, unknown>
): UseMutationResult<TResult, TError, TParams> {
  const { apiClient } = useClientProvider();

  return useSimpleMutation(apiClient, query, options);
}

export { createAxiosClient } from "./client-helpers.axios";
