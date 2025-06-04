import { createStore } from 'idb-keyval';

const customStore = createStore('ncip-db', 'offline-store');

export const saveOfflineData = async (key: string, data: unknown) => {
  await customStore.set(key, data);
};

export const getOfflineData = async <T>(key: string): Promise<T | undefined> => {
  return customStore.get<T>(key);
};

export const removeOfflineData = async (key: string) => {
  await customStore.del(key);
};
