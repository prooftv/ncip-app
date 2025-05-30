declare module 'idb-keyval' {
  export function get<T = any>(key: IDBValidKey): Promise<T | undefined>;
  export function set(key: IDBValidKey, value: any): Promise<void>;
  export function del(key: IDBValidKey): Promise<void>;
  export function createStore(
    dbName: string,
    storeName: string
  ): {
    get: <T>(key: IDBValidKey) => Promise<T | undefined>;
    set: (key: IDBValidKey, value: any) => Promise<void>;
    del: (key: IDBValidKey) => Promise<void>;
  };
}
