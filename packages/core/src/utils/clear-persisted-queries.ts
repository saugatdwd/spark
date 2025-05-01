import { DEFAULT_CONSTANTS } from "../constants/default-constants";

export function clearPersistedQueries() {
  const keys = Object.keys(localStorage);
  const queryKeys = keys.filter((key) => key.startsWith(DEFAULT_CONSTANTS.persisted_query_key_initiator));

  queryKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
}
