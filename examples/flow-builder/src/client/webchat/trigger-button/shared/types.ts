import { WebchatArgs } from '@botonic/react'

import { Language } from '../../../../shared/locales'

export interface WebchatOptions {
  elementId: string
  webchatUrl: string
  webchatConfig: WebchatArgs
  language: string
}

export interface TriggerButtonOptions {
  language?: Language
}
