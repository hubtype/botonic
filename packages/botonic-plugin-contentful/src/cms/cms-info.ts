import { Locale } from '../nlp'
import { ContentType } from './cms'

export class LocaleInfo {
  constructor(
    readonly code: Locale,
    readonly name: string,
    readonly fallback: Locale | undefined,
    readonly isDefault: boolean
  ) {}
}

export interface CmsInfo {
  contentTypes(): Promise<ContentType[]>
  defaultLocale(): Promise<LocaleInfo>

  locales(): Promise<{ [code: string]: LocaleInfo }>
}
