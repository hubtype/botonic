// eslint-disable-next-line node/no-missing-import
import { MetaLinkProps } from 'contentful-management/dist/typings/common-types'
// eslint-disable-next-line node/no-missing-import
import { EntryProp } from 'contentful-management/dist/typings/entities/entry'
// eslint-disable-next-line node/no-missing-import
import { LocaleProps } from 'contentful-management/dist/typings/entities/locale'
import * as schema from 'contentful-import/dist/utils/schema'
import fs from 'fs'
import * as joi from 'joi'

export type I18nFieldValues = { [locale: string]: string | MetaLinkProps }

export class ExportObject {
  payload: {
    entries: EntryProp[]
    locales?: LocaleProps[]
  }

  constructor(jsonObject: any) {
    ExportObject.validate(jsonObject)
    this.payload = jsonObject
  }

  static validate(jsonObject: any) {
    const err = joi.validate(jsonObject, schema.payloadSchema)
    if (err.error) {
      throw new Error(err.error.message)
    }
  }

  static fromJsonFile(filename: string): ExportObject {
    //we could use Joi schemas in node_modules/contentful-import/dist/utils/schema.js
    const json = JSON.parse(fs.readFileSync(filename, 'utf8'))
    return new ExportObject(json)
  }

  write(filename: string): void {
    const json = JSON.stringify(this.payload, undefined, 2)
    fs.writeFileSync(filename, json, 'utf8')
  }
}
