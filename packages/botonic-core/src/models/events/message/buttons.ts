export interface BaseButton {
  title: string
}

export interface WebviewButton extends BaseButton {
  webview: any
  params?: any
}

export interface UrlButton extends BaseButton {
  url: string
  target?: string
}

export interface PayloadButton extends BaseButton {
  payload: string
}

export type Button = PayloadButton | UrlButton | WebviewButton

export interface WithButtons {
  buttons?: Button[]
}
