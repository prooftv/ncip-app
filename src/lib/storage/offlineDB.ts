import idb from 'idb-keyval';

const customStore = idb.createStore('ncip-db', 'offline-store');

export const saveOfflineData = async (key: string, data: unknown) => {
  await idb.set(key, data, customStore);
};

export const getOfflineData = async <T>(key: string): Promise<T | undefined> => {
  return idb.get<T>(key, customStore);
};

export const removeOfflineData = async (key: string) => {
  await idb.del(key, customStore);
};
