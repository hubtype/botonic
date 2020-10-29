import { useLocalStorage, useSessionStorage } from 'react-use-storage'

export function useStorageState(storage, storageKey) {
  const [botonicLocalState, saveLocalState] = useLocalStorage(storageKey)
  const [botonicSessionState, saveSessionState] = useSessionStorage(storageKey)
  if (storage === null) return [undefined, undefined]
  if (storage === sessionStorage) return [botonicSessionState, saveSessionState]
  return [botonicLocalState, saveLocalState]
}
