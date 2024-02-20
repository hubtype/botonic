import * as contentful from 'contentful'

import { ContentType } from '../cms'
import { CmsInfo, LocaleInfo } from '../cms/cms-info'
import { ContentfulOptions } from '../plugin'
import { isOfType } from '../util/enums'
import { createContentfulClientApi } from './delivery-utils'

export class ContentfulInfo implements CmsInfo {
  client: contentful.ContentfulClientApi

  constructor(readonly options: ContentfulOptions) {
    this.client = createContentfulClientApi(options)
  }

  async contentTypes(): Promise<ContentType[]> {
    const models = await this.client.getContentTypes()
    return models.items
      .map(m => {
        if (isOfType(m.sys.id, ContentType)) {
          return m.sys.id
        }
        return undefined
      })
      .filter(m => !!m) as ContentType[]
  }

  async defaultLocale(): Promise<LocaleInfo> {
    const locales = await this.locales()
    for (const locale of Object.values(locales)) {
      if (locale.isDefault) {
        return locale
      }
    }
    throw new Error(`No default locale found`)
  }

  async locales(): Promise<{ [locale: string]: LocaleInfo }> {
    const locales = (await this.client.getLocales()).items
    return locales
      .map(
        l =>
          new LocaleInfo(l.code, l.name, l.fallbackCode || undefined, l.default)
      )
      .reduce(
        (newObj, l) => {
          newObj[l.code] = l
          return newObj
        },
        {} as { [locale: string]: LocaleInfo }
      )
  }
}
