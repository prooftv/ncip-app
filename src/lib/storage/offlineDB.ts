import { get, set, del, createStore } from 'idb-keyval'

const customStore = createStore('ncip-db', 'offline-store')

export const saveOfflineData = async (key: string, data: unknown) => {
  await set(key, data, customStore)
}

export const getOfflineData = async <T>(key: string): Promise<T | undefined> => {
  return await get<T>(key, customStore)
}

export const deleteOfflineData = async (key: string) => {
  await del(key, customStore)
}
