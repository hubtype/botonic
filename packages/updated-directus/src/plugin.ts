import * as cms from './cms'
import * as search from './search'
import { Directus } from './directus/directus'
import { KeywordsOptions, Search } from './search'

export type DirectusCredentials = {
  token: string
  apiEndPoint: string
}

export type DirectusOptions = {
  credentials: DirectusCredentials
  keywordOptions: KeywordsOptions
}

export default class BotonicPluginDirectus {
  readonly cms: cms.CMS
  readonly search: search.Search

  constructor(opt: DirectusOptions) {
    this.cms = new Directus(opt)
    this.search = new Search(this.cms, opt.keywordOptions)
  }

  pre(r: { input: any; session: any; lastRoutePath: any }) {}

  post(r: { input: any; session: any; lastRoutePath: any; response: any }) {}
}
