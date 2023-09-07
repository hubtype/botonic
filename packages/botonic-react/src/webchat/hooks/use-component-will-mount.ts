import { useMemo } from 'react'

export const useComponentWillMount = func => {
  useMemo(func, [])
}
