import { FlowBuilderJSONVersion } from '../types'

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
  apiUrl?: string
  version?: FlowBuilderJSONVersion
  orgId: string
  botId: string
  webviewId: string
  locale: string
}

export interface UseWebviewContents {
  isLoading: boolean
  error: boolean
  webviewContentsContext: WebviewContentsContextType
}

export interface WebviewContentsContextType {
  getTextContent: (code: string) => string | undefined
  getImageSrc: (code: string) => string | undefined
  setCurrentLocale: (locale: string) => void
}
