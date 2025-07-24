import { Input, PluginPreRequest } from '@botonic/core'

export interface Credentials {
  projectId: string
  privateKeyId: string
  privateKey: string
  clientEmail: string
}

export interface PluginOptions {
  credentials: Credentials
  translateTo?: string[]
  whitelist?: string[]
}
export interface Translations {
  [languageCode: string]: string
}

export type PluginPreRequestGoogleTranslation = PluginPreRequest & {
  input: Input & {
    translations: Translations
    language: string
  }
}
