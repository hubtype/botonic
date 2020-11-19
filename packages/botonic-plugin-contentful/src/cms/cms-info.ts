import { Locale } from '../nlp'
import { ContentType } from './cms'

export class LocaleInfo {
  constructor(
    readonly name: Locale,
    readonly fallback: Locale | undefined,
    readonly isDefault: boolean
  ) {}
}

export interface CmsInfo {
  contentTypes(): Promise<ContentType[]>
  defaultLocale(): Promise<LocaleInfo>

  locales(): Promise<{ [locale: string]: LocaleInfo }>
}
