import { EncryptedStorage } from "../services";
import { CurrentIdentity } from "../models";

export const isAuthenticated = (authStorageKey: string): boolean => {
  const identity = EncryptedStorage.getItem<CurrentIdentity | null>(authStorageKey || "api-auth-identity");
  return !isTokenExpired(identity?.token);
};

export const isTokenExpired = (token?: string): boolean => {
  if (token === "mock_access_token") {
    return false;
  }

  return !token;
};

export const getHeaders = (identity?: CurrentIdentity | null): Record<string, string> => {
  if (identity) {
    return {
      Authorization: `Bearer ${identity.token}`,
    };
  }
  return {};
};
