interface IStorage {
  length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string;
  removeItem(key: string): void;
  setItem(key: string, value: string | null): void;
}

export class ProxyStorage implements IStorage {
  memoryLocalStorage: Record<string, string | null> = {};

  length: number = Object.keys(this.memoryLocalStorage).length;

  setItem(key: string, value: string | null) {
    this.memoryLocalStorage[key] = value;
    this.length = Object.keys(this.memoryLocalStorage).length;
  }
  getItem(key: string) {
    return this.memoryLocalStorage[key];
  }
  removeItem(key: string) {
    delete this.memoryLocalStorage[key];
    this.length = Object.keys(this.memoryLocalStorage).length;
  }
  clear() {
    this.memoryLocalStorage = {};
    this.length = Object.keys(this.memoryLocalStorage).length;
  }

  key(index: number) {
    return Object.keys(this.memoryLocalStorage)[index];
  }

  keys() {
    return Object.keys(this.memoryLocalStorage);
  }
}
