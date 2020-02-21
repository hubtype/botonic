import * as cms from './cms'
import Contentful from './contentful'
import { KeywordsOptions, Normalizer, StemmingBlackList } from './nlp'
import { Search } from './search'
import { BotonicMsgConverter } from './render'

interface NlpOptions {
  blackList: { [locale: string]: StemmingBlackList[] }
}

interface OptionsBase {
  renderer?: BotonicMsgConverter
  search?: Search
  nlpOptions?: NlpOptions
  keywordsOptions?: { [locale: string]: KeywordsOptions }
}

export interface CmsOptions extends OptionsBase {
  cms?: cms.CMS
}

export const DEFAULT_TIMEOUT_MS = 30000
export const DEFAULT_CACHE_TTL_MS = 10000

export interface ContentfulOptions extends OptionsBase {
  spaceId: string
  environment?: string
  accessToken: string
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
}

export default class BotonicPluginContentful {
  readonly cms: cms.CMS

  readonly renderer: BotonicMsgConverter

  readonly search: Search

  constructor(opt: CmsOptions | ContentfulOptions) {
    const optionsAny = opt as any
    if (optionsAny.cms) {
      this.cms = optionsAny.cms
    } else {
      const contOptions = opt as ContentfulOptions
      this.cms = new Contentful(contOptions)
    }
    this.cms = new cms.ErrorReportingCMS(this.cms)
    this.renderer = opt.renderer || new BotonicMsgConverter()

    if (opt.search) {
      this.search = opt.search
    } else {
      const normalizer = opt.nlpOptions
        ? new Normalizer(opt.nlpOptions.blackList)
        : new Normalizer()
      this.search = new Search(this.cms, normalizer, opt.keywordsOptions)
    }
  }

  pre(r: { input: any; session: any; lastRoutePath: any }) {}

  post(r: { input: any; session: any; lastRoutePath: any; response: any }) {}
}
