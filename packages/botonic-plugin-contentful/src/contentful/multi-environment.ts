import { MultiContextCms } from '../cms/cms-multilocale'
import * as cms from '../cms'
import { CMS } from '../cms'
import { Locale } from '../nlp'
import { ContentfulCredentials, ContentfulOptions } from '../plugin'
import { Contentful } from './cms-contentful'
import { shallowClone } from '../util'

/**
 * Set it to ContentfulOptions.contentfulFactory to connect to
 * different Contentful environments depending on the Context's Locale
 * for each call to CMS
 */
export function multiEnvironmentFactory(environmentByLocale?: {
  [locale: string]: ContentfulCredentials
}): (contOptions: ContentfulOptions) => CMS {
  const multiFactory = new MultiEnvironmentFactory(environmentByLocale)
  return contOptions =>
    new MultiContextCms((ctx?: cms.Context) =>
      multiFactory.get(contOptions, ctx)
    )
}

/**
 * Creates a different Contentful environments for each configured Locale.
 * When the call to CMS does not specify a locale, it uses the credentials from
 * ContentfulOptions and it informs through the logger
 */
export class MultiEnvironmentFactory {
  private cache = new Map<Locale, CMS>()
  private defaultCms: CMS | undefined

  constructor(
    private readonly environmentByLocale?: {
      [locale: string]: ContentfulCredentials
    },
    private readonly contentfulFactory = (o: ContentfulOptions) =>
      new Contentful(o) as CMS,
    private readonly logger = console.error
  ) {}

  public get(contOptions: ContentfulOptions, ctx?: cms.Context): CMS {
    const credentials = this.getCredentials(ctx)
    if (!credentials) {
      if (!this.defaultCms) {
        this.defaultCms = this.contentfulFactory(contOptions)
      }
      return this.defaultCms
    }

    const locale = ctx!.locale!
    let cms = this.cache.get(locale)
    if (!cms) {
      const opts = shallowClone(contOptions)
      opts.spaceId = credentials.spaceId
      opts.environment = credentials.environment
      opts.accessToken = credentials.accessToken

      cms = this.contentfulFactory(opts)
      this.cache.set(locale, cms)
    }

    return cms
  }

  private getCredentials(ctx?: cms.Context): ContentfulCredentials | undefined {
    if (!ctx) {
      this.logger(
        'MultiLocaleCmsFactory called with no context. Using default credentials'
      )
      return undefined
    }
    if (!ctx.locale) {
      this.logger(
        'MultiLocaleCmsFactory called with no context locale. Using default credentials'
      )
      return undefined
    }
    const credentials = this.environmentByLocale![ctx.locale]
    if (!credentials) {
      this.logger(
        `MultiLocaleCmsFactory has no credentials for locale ${ctx.locale}. Using default credentials`
      )
      return undefined
    }
    return credentials
  }
}
