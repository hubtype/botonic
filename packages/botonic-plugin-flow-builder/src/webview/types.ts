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

export interface UseWebviewContentsProps<T> {
  apiUrl?: string
  version?: FlowBuilderJSONVersion
  orgId: string
  botId: string
  webviewId: string
  locale: string
  mapContents: Record<keyof T, string>
}

export interface UseWebviewContents<T> {
  isLoading: boolean
  error: boolean
  webviewContentsContext: WebviewContentsContextType<T>
}

export interface WebviewContentsContextType<T> {
  getTextContent: (code: string) => string
  getImageSrc: (code: string) => string
  setCurrentLocale: (locale: string) => void
  contents: Record<keyof T, string>
}
