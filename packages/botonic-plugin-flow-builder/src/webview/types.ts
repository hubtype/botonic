export enum WebviewContentType {
  TEXT = 'webview-text',
  IMAGE = 'webview-image',
}

export interface WebviewContentsResponse {
  webview_contents: (WebviewTextContent | WebviewImageContent)[]
}

export interface WebviewTextContent {
  code: string
  type: WebviewContentType.TEXT
  content: {
    text: { message: string; locale: string }[]
  }
}

export interface WebviewImageContent {
  code: string
  type: WebviewContentType.IMAGE
  content: {
    image: { file: string; locale: string }[]
  }
}

export interface UseWebviewContentsProps {
  flowBuilderApiUrl: string
  version: 'draft' | 'latest'
  orgId: string
  botId: string
  webviewId: string
  locale: string
}

export interface UseWebviewContents {
  isLoading: boolean
  webviewContext: WebviewContentsContextType
}

export interface WebviewContentsContextType {
  getTextContent: (code: string, locale: string) => string | undefined
  getImageSrc: (code: string, locale: string) => string | undefined
  setCurrentLocale: (locale: string) => void
}
