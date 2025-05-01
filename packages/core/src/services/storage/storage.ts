import { logger } from "../../utils/dev-utils";

import { ProxyStorage } from "./storage.proxy";

if (typeof localStorage === "undefined") {
  // @ts-ignore
  global["localStorage"] = new ProxyStorage();
}

type StorageListener = (key: string) => void;
type StorageListenerRemove = {
  remove: () => void;
};

function prepareObject(value?: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  // eslint-disable-next-line no-useless-escape
  return typeof value === "string" ? `\"${value}\"` : JSON.stringify(value);
}

class Storage {
  private readonly listeners: Record<string, Set<StorageListener>>;

  constructor() {
    this.listeners = {};
  }

  setItem<I>(key: string, data: I) {
    localStorage?.setItem(key, prepareObject(data));
    this.notifyListeners(key);
  }

  removeItem(key: string) {
    this.notifyListeners(key);
    localStorage?.removeItem(key);
  }

  getItem<I>(key: string): I | null {
    try {
      const rawData = localStorage?.getItem(key);
      return rawData ? JSON.parse(rawData) : null;
    } catch (e) {
      logger.log(e);
      return null;
    }
  }

  keys() {
    return Object.keys(localStorage);
  }

  clear() {
    const keys = this.keys();
    localStorage?.clear();
    keys.forEach((key) => {
      this.notifyListeners(key);
    });
  }

  addOnValueChangedListener(key: string, onChange: StorageListener): StorageListenerRemove {
    this.listeners[key] = this.listeners[key] ?? new Set<StorageListener>();
    this.listeners[key].add(onChange);
    return {
      remove: () => {
        this.listeners[key].delete(onChange);
      },
    };
  }

  private notifyListeners(key: string) {
    this.listeners[key]?.forEach((listener) => {
      listener?.(key);
    });
  }
}

// @ts-ignore
const globalInstance: any = globalThis ?? global;

export const LocalStorage: Storage = globalInstance?.["LocalStorage"] ?? Object.freeze(new Storage());

export const EncryptedStorage: Storage = globalInstance?.["EncryptedStorage"] ?? LocalStorage;
