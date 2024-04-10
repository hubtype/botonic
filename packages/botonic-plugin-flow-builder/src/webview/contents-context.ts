import { createContext } from 'react'

import { WebviewContentsContextType } from './types'

export const WebviewContentsContext = createContext<WebviewContentsContextType>(
  {
    getTextContent: () => undefined,
    getImageSrc: () => undefined,
    textContents: [],
    imageContents: [],
  }
)
