import * as cms from './cms'
import { Directus } from './directus/directus'

export type DirectusCredentials = {
  token: string
  apiEndPoint: string
}

export type DirectusOptions = {
  credentials: DirectusCredentials
}

export default class BotonicPluginDirectus {
  readonly cms: cms.CMS

  constructor(opt: DirectusOptions) {
    this.cms = new Directus(opt)
  }

  pre(r: { input: any; session: any; lastRoutePath: any }) {}

  post(r: { input: any; session: any; lastRoutePath: any; response: any }) {}
}
