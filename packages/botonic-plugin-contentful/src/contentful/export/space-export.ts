// eslint-disable-next-line node/no-missing-import
import { EntryProp } from 'contentful-management/dist/typings/entities/entry'
// eslint-disable-next-line node/no-missing-import
import { LocaleProps } from 'contentful-management/dist/typings/entities/locale'
// eslint-disable-next-line node/no-missing-import
import { ContentTypeProps } from 'contentful-management/dist/typings/entities/content-type'
// eslint-disable-next-line node/no-missing-import
import { AssetProps } from 'contentful-management/dist/typings/entities/asset'

import * as schema from 'contentful-import/dist/utils/schema'
import fs from 'fs'
import * as joi from 'joi'

export type I18nFieldValues = { [locale: string]: any }

/**
 * Allows modifying contentful spaces exported with "contentful space export"
 */
export class SpaceExport {
  payload: {
    entries: EntryProp[]
    locales?: LocaleProps[]
    contentTypes?: ContentTypeProps[]
    assets?: AssetProps[]
  }

  constructor(jsonObject: any) {
    SpaceExport.validate(jsonObject)
    this.payload = jsonObject
  }

  getLocale(locale: string): LocaleProps | undefined {
    if (!this.payload.locales) {
      return undefined
    }
    return this.payload.locales.find(loc => loc.code == locale)
  }

  getDefaultLocale(): LocaleProps | undefined {
    if (!this.payload.locales) {
      return undefined
    }
    for (const loc of this.payload.locales) {
      if (loc.default) {
        return loc
      }
    }
    return undefined
  }

  private static validate(jsonObject: any) {
    const err = joi.validate(
      SpaceExport.hideFieldsWithBadSchema(jsonObject),
      schema.payloadSchema
    )
    if (err.error) {
      throw new Error(err.error.message)
    }
  }

  private static hideFieldsWithBadSchema(jsonObject: any): any {
    // contentTypes fails with types withs items
    // see https://github.com/contentful/contentful-import/issues/262
    const clone = { ...jsonObject }
    for (const field of ['contentTypes', 'assets', 'editorInterfaces']) {
      delete clone[field]
    }
    return clone
  }

  static fromJsonFile(filename: string): SpaceExport {
    //we could use Joi schemas in node_modules/contentful-import/dist/utils/schema.js
    const json = JSON.parse(fs.readFileSync(filename, 'utf8'))
    return new SpaceExport(json)
  }

  write(filename: string): void {
    const json = JSON.stringify(this.payload, undefined, 2)
    fs.writeFileSync(filename, json, 'utf8')
  }
}
