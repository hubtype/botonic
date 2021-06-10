export interface Credentials {
  projectId: string
  privateKeyId: string
  privateKey: string
  clientEmail: string
}

export interface TranslationOptions {
  targets: string[]
}

export interface DetectLanguageOptions {
  whitelist: string[]
}

export interface PluginOptions {
  credentials: Credentials
  translation?: TranslationOptions
  languageDetection?: DetectLanguageOptions
}
