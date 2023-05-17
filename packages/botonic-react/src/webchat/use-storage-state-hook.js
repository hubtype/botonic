import { useCallback, useEffect, useState } from 'react'

// Code taken from https://github.com/leny/react-use-storage/blob/master/src/index.js
const IS_BROWSER =
  typeof window !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  typeof document !== 'undefined'

export function useStorageState(storage, key, defaultValue) {
  let evtTarget

  try {
    evtTarget = new EventTarget()
  } catch {
    evtTarget = (IS_BROWSER ? document : {})?.createElement?.('phony')
  }

  const raw = storage?.getItem(key)

  const [value, setValue] = useState(raw ? JSON.parse(raw) : defaultValue)

  const updater = useCallback(
    (updatedValue, remove = false) => {
      setValue(updatedValue)
      storage[remove ? 'removeItem' : 'setItem'](
        key,
        JSON.stringify(updatedValue)
      )
      evtTarget.dispatchEvent(
        new CustomEvent('storage_change', { detail: { key } })
      )
    },
    [key]
  )

  defaultValue != null && !raw && updater(defaultValue)

  useEffect(() => {
    const listener = ({ detail }) => {
      if (detail.key === key) {
        const lraw = storage?.getItem(key)

        lraw !== raw && setValue(JSON.parse(lraw))
      }
    }

    evtTarget.addEventListener('storage_change', listener)
    return () => evtTarget.removeEventListener('storage_change', listener)
  })

  if (storage === null) {
    return [undefined, undefined]
  }
  return [value, updater, () => updater(null, true)]
}
