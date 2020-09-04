import { Locale } from '../nlp'
import { CallbackMap } from './callback'

/**
 * Default values when the context argument {@link Context} is not specified in a {@link CMS} call.
 */
export const DEFAULT_CONTEXT: Context = {}

export interface Context {
  locale?: Locale
  callbacks?: CallbackMap
  /**
   * When set, empty fields will be blank even if they have a value for the fallback locale
   * NOT applying it so far for assets because cms.Asset does not support blank assets
   */
  ignoreFallbackLocale?: boolean

  /**
   * Useful for debugging. Limit how many contents are requested in parallel.
   * If not specified, the contents will use as much parallelism as possible.
   */
  concurrency?: number

  /**
   * Eg. If a button cannot show any text because the content has no shortText, show its name
   * True by default
   */
  fixMissingData?: boolean
}

export interface ContextWithLocale extends Context {
  locale: Locale
}
