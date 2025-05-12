import { Session } from 'node:inspector'

import { WebchatMessage } from '../index-types'
import { stringifyWithRegexs } from '../util/regexs'
import { DevSettings } from './context/types'
import { WebchatTheme } from './theme/types'

export interface BotonicStorage {
  messages: WebchatMessage[]
  session: Session
  lastRoutePath: string
  devSettings: DevSettings
  lastMessageUpdate: string
  themeUpdates: WebchatTheme
}

export function useBotonicStorage(storage: Storage, storageKey: string) {
  const getBotonicStorage = (): BotonicStorage | undefined => {
    const botonicStorage = storage.getItem(storageKey)
    return botonicStorage ? JSON.parse(botonicStorage) : undefined
  }

  const getBotonicStorageAttribute = <T = any>(key: string): T => {
    const botonicStorage = getBotonicStorage()
    return botonicStorage?.[key]
  }

  const setBotonicStorage = (value: any) => {
    const stringValueJSON = JSON.stringify(
      JSON.parse(stringifyWithRegexs(value))
    )
    storage.setItem(storageKey, stringValueJSON)
  }

  return {
    getBotonicStorage,
    setBotonicStorage,
    getBotonicStorageAttribute,
  }
}
