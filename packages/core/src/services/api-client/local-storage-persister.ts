import { QueryClient, QueryFunction, QueryKey, QueryMeta } from "@tanstack/react-query";

import { DEFAULT_CONSTANTS } from "../../constants/default-constants";

export const localStoragePersister = async (
  queryFn: QueryFunction<unknown, NoInfer<any>, never>,
  context: {
    queryKey: QueryKey;
    client: QueryClient;
    signal: AbortSignal;
    meta: QueryMeta | undefined;
    pageParam?: unknown;
    direction?: unknown;
  }
) => {
  const queryKeyString = DEFAULT_CONSTANTS.persisted_query_key_initiator + btoa(JSON.stringify(context.queryKey));

  //get data from localStorage first
  const storedItem = localStorage.getItem(queryKeyString);
  if (storedItem) {
    const { data, expiry } = JSON.parse(storedItem);
    const now = new Date().getTime();

    // Check if the data has not expired
    if (expiry && now < expiry) {
      return Promise.resolve(data);
    } else {
      localStorage.removeItem(queryKeyString);
    }
  }

  const data = await Promise.resolve(queryFn({ ...context, client: context.client }));

  // Calculate expiry time
  const cacheLifeSpan: number = (context?.meta?.cacheLifeSpan as number) || DEFAULT_CONSTANTS.cache_life_span;
  const expiry = cacheLifeSpan > 0 ? new Date().getTime() + cacheLifeSpan : null;

  // Store the result in localStorage with expiry
  localStorage.setItem(queryKeyString, JSON.stringify({ data, expiry }));

  return data;
};
