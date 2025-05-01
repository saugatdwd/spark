import { useEffect, useMemo, useState } from "react";

import { EncryptedStorage, LocalStorage } from "./storage";

export const useStorage = <T extends string | number | boolean | object>(
  key: string
): [T | undefined, (value?: T | undefined) => void] => {
  const [item, setItem] = useState<T | undefined | null>(() => LocalStorage.getItem<T>(key));

  useEffect(() => {
    const subscription = LocalStorage.addOnValueChangedListener(key, () => {
      setItem(LocalStorage.getItem(key));
    });
    return () => subscription?.remove();
  }, []);

  return useMemo(
    () => [
      item ?? undefined,
      (value) => {
        if (value !== undefined) {
          LocalStorage.setItem(key, value);
        } else {
          LocalStorage.removeItem(key);
        }
        setItem(value);
      },
    ],
    [item]
  );
};

export const useEncryptedStorage = <T extends string | number | boolean | object>(
  key: string
): [T | undefined, (value?: T | undefined) => void] => {
  const [item, setItem] = useState<T | undefined>(() => EncryptedStorage.getItem<T>(key) ?? undefined);

  useEffect(() => {
    const subscription = EncryptedStorage.addOnValueChangedListener(key, () => {
      setItem(EncryptedStorage.getItem(key) ?? undefined);
    });
    return () => subscription?.remove();
  }, []);

  return useMemo(
    () => [
      item,
      (value) => {
        if (value !== undefined) {
          EncryptedStorage.setItem(key, value);
        } else {
          EncryptedStorage.removeItem(key);
        }
      },
    ],
    [item]
  );
};
