import { Locale } from '../nlp'
import { CallbackMap } from './callback'

/**
 * Default values when the context argument {@link Context} is not specified in a {@link CMS} call.
 */
export const DEFAULT_CONTEXT: Context = {}

/* markdown where bold is '*' */
export const MARKUP_WHATSAPP = 'whatsapp'
/*markdown where bold is '__' */
export const MARKUP_CONTENTFUL = 'contentful'

export type MarkupType = typeof MARKUP_WHATSAPP | typeof MARKUP_CONTENTFUL

export interface Context {
  locale?: Locale
  callbacks?: CallbackMap
  /**
   * When set, empty fields will be blank even if they have a value for the fallback locale
   * NOT applying it so far for assets because cms.Asset does not support blank assets
   */
  ignoreFallbackLocale?: boolean
  markup?: MarkupType
}

export interface ContextWithLocale extends Context {
  locale: Locale
}
