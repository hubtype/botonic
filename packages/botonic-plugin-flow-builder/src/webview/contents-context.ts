import { createContext } from 'react'

import { MapContentsType, WebviewContentsContextType } from './types'

export const createWebviewContentsContext = <T extends MapContentsType>() =>
  createContext<WebviewContentsContextType<T>>({
    getTextContent: () => '',
    getImageSrc: () => '',
    setCurrentLocale: () => undefined,
    contents: {} as Record<keyof T, string>,
  })
