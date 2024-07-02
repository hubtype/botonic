import { createContext } from 'react'

import { WebviewContentsContextType } from './types'

export const WebviewContentsContext = createContext<
  WebviewContentsContextType<unknown>
>({
  getTextContent: () => '',
  getImageSrc: () => '',
  setCurrentLocale: () => undefined,
  contents: {},
})
