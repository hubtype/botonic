import { createContext } from 'react'

import { WebviewContentsContextType } from './types'

export const WebviewContentsContext = createContext<WebviewContentsContextType>(
  {
    getTextContent: () => '',
    getImageSrc: () => '',
    setCurrentLocale: () => undefined,
    contents: {},
  }
)
