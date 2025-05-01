import { useMemo, useState } from "react";

import { AuthProviderProps, CurrentIdentity } from "../models";
import { EncryptedStorage } from "../services";
import { isTokenExpired } from "../utils";
import { clearPersistedQueries } from "../utils/clear-persisted-queries";

import { AuthProviderContext } from "./auth-provider-context";

export function AuthProvider({ children, storageKey, onLogin, onLogout, ...props }: AuthProviderProps) {
  const [identity, setIdentity] = useState<CurrentIdentity | null>(() =>
    EncryptedStorage.getItem<CurrentIdentity>(storageKey)
  );

  const value = useMemo(
    () => ({
      identity,
      isAuthenticated: () => {
        return !isTokenExpired(identity?.token);
      },
      login: (identity: CurrentIdentity) => {
        EncryptedStorage.setItem(storageKey, identity);
        setIdentity(identity);

        if (window?.location) {
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }

        onLogin?.(identity);
      },
      logout: () => {
        EncryptedStorage.removeItem(storageKey);
        setIdentity(null);
        clearPersistedQueries();

        if (window?.location) {
          window.location.reload();
        }
        onLogout?.();
      },
    }),
    [onLogout, onLogin, storageKey, identity]
  );

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}
