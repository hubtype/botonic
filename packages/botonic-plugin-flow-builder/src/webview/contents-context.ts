import { createContext } from 'react'

import { MapContentsType, WebviewContentsContextType } from './types'

/* 
   Define a generic type parameter for your context
   WebviewContentsContext is a function that returns a context object with the type parameter T
   It is necessary to create the context outside the component
   e.g. 

   interface WebviewContents {
      textIntro: string
      image2: string
      headerWebview: string
      image: string
    }

    export const MyWebviewContentsContext = WebviewContentsContext<WebviewContents>()

    Then you can use it in your component like this:
    <MyWebviewContentsContext.Provider value={webviewContentsContext}>
    ...// your components
    </MyWebviewContentsContext.Provider>

    In your components you can use the context to read contents like this:

    const { contents } = useContext(MyWebviewContentsContext)
*/
export const createWebviewContentsContext = <T extends MapContentsType>() =>
  createContext<WebviewContentsContextType<T>>({
    getTextContent: () => '',
    getImageSrc: () => '',
    setCurrentLocale: () => undefined,
    contents: {} as Record<keyof T, string>,
  })
