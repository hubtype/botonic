import * as cms from './cms'
import { LogCMS } from './cms'
import { Contentful } from './contentful/cms-contentful'
import { KeywordsOptions, Locale, Normalizer, StemmingBlackList } from './nlp'
import { BotonicMsgConverter } from './render'
import { Search } from './search'

interface NlpOptions {
  blackList: { [locale: string]: StemmingBlackList[] }
}

interface OptionsBase {
  renderer?: BotonicMsgConverter
  search?: Search
  normalizer?: Normalizer
  nlpOptions?: NlpOptions
  keywordsOptions?: { [locale: string]: KeywordsOptions }
  logger?: (msg: string) => void
}

export interface CmsOptions extends OptionsBase {
  cms?: cms.CMS
}

export const DEFAULT_TIMEOUT_MS = 30000
export const DEFAULT_CACHE_TTL_MS = 10000

export interface ContentfulCredentials {
  spaceId: string
  environment?: string
  accessToken: string
}

export interface ContentfulOptions extends OptionsBase, ContentfulCredentials {
  /**
   * does not work at least when there's no network during the first connection
   * Defaults to {@link DEFAULT_TIMEOUT_MS}
   */
  timeoutMs?: number
  /**
   * Contents are cached up to this amount of time.
   * Defaults to {@link DEFAULT_CACHE_TTL_MS}
   */
  cacheTtlMs?: number
  disableCache?: boolean

  contentfulFactory?: (opts: ContentfulOptions) => cms.CMS

  /** For locales not supported by the CMS (eg. English on a non-English country) */
  cmsLocale?: (locale?: Locale) => Locale | undefined

  /**
   * If the delivery of an optional part of a content fails (eg. a referenced content or assert),
   * the flag defines whether the content should be partially delivered
   * or an error should be raised.
   * False by default
   */
  resumeErrors?: boolean

  logCalls?: boolean
}

export default class BotonicPluginContentful {
  readonly cms: cms.CMS

  readonly renderer: BotonicMsgConverter

  readonly search: Search

  readonly normalizer: Normalizer

  constructor(opt: CmsOptions | ContentfulOptions) {
    const optionsAny = opt as any
    if (optionsAny.cms) {
      this.cms = optionsAny.cms
    } else {
      const contOptions = opt as ContentfulOptions
      const factory =
        contOptions.contentfulFactory ||
        (o => {
          let cms: cms.CMS = new Contentful(o)
          if (contOptions.logCalls) {
            cms = new LogCMS(cms, contOptions)
          }
          return cms
        })
      this.cms = factory(contOptions)
    }
    this.cms = new cms.ErrorReportingCMS(this.cms, opt.logger)
    this.renderer = opt.renderer || new BotonicMsgConverter()

    if (opt.search) {
      this.search = opt.search
      this.normalizer = opt.normalizer || new Normalizer()
    } else {
      this.normalizer = opt.nlpOptions
        ? new Normalizer(opt.nlpOptions.blackList)
        : new Normalizer()
      this.search = new Search(this.cms, this.normalizer, opt.keywordsOptions)
    }
  }

  pre(r: { input: any; session: any; lastRoutePath: any }) {}

  post(r: { input: any; session: any; lastRoutePath: any; response: any }) {}
}
