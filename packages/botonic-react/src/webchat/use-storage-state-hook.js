import { useCallback, useEffect, useState } from 'react'

//Code taken from https://github.com/leny/react-use-storage
const evtTarget = new EventTarget()

export function useStorageState(storage, key, defaultValue) {
  const raw = storage?.getItem(key)

  const [value, setValue] = useState(raw ? JSON.parse(raw) : defaultValue)

  const updater = useCallback(
    (updatedValue, remove = false) => {
      setValue(updatedValue)
      storage[remove ? 'removeItem' : 'setItem'](
        key,
        JSON.stringify(updatedValue)
      )
      console.log({ evtTarget })
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
