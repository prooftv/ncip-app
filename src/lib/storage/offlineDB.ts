import { get, set, del, createStore } from 'idb-keyval'

const customStore = createStore('ncip-db', 'offline-store')

export const saveOfflineData = async (key: string, data: any) => {
  await set(key, data, customStore)
}

export const getOfflineData = async (key: string) => {
  return await get(key, customStore)
}

export const deleteOfflineData = async (key: string) => {
  await del(key, customStore)
}
