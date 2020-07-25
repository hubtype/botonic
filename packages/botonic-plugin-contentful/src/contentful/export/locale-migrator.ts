import { ExportObject, I18nFieldValues } from './export-object'
import assert from 'assert'

export class LocaleMigrator {
  constructor(
    readonly fromLoc: string,
    readonly toLoc: string,
    readonly removeLocs: string[]
  ) {}

  migrate(exportObj: ExportObject): void {
    this.migrateEntries(exportObj)
    this.migrateLocales(exportObj)
  }

  migrateEntries(exportObj: ExportObject): void {
    for (const entry of exportObj.payload.entries) {
      for (const fieldName of Object.getOwnPropertyNames(entry.fields)) {
        try {
          const vals = entry.fields[fieldName] as I18nFieldValues
          this.migrateField(vals)
          for (const loc in this.removeLocs) {
            delete vals[loc]
          }
        } catch (e) {
          throw Error(
            `converting entry ${entry.sys.id} field ${fieldName}: ${e}`
          )
        }
      }
    }
  }

  migrateField(value: I18nFieldValues): void {
    /**
     * Example: from es default to en default
     * [es: "payload"] => [en: "payload"]
     */
    if (value[this.fromLoc] == undefined) {
      throw new Error(`No value for locale ${this.fromLoc}`)
    }
    if (!(this.toLoc in value)) {
      value[this.toLoc] = value[this.fromLoc]
    }
    delete value[this.fromLoc]
  }

  private migrateLocales(exportObj: ExportObject) {
    let locales = exportObj.payload.locales
    if (locales) {
      const fromLoc = locales.find(loc => loc.code == this.fromLoc)
      assert(fromLoc)
      const toLoc = locales.find(loc => loc.code == this.toLoc)
      if (toLoc) {
        locales = locales.filter(loc => loc.code != this.fromLoc)
        if (fromLoc.fallbackCode == toLoc.fallbackCode) {
          // @ts-ignore a bug fallbackCode type?
          toLoc.fallbackCode = null
          console.log('Removing fallback')
        }
        if (fromLoc.default) {
          console.log(`Setting '${toLoc.code}' as default locale`)
          toLoc.default = true
        }
      } else {
        fromLoc.code = this.toLoc
        fromLoc.name = this.toLoc
      }
      // remove locales
      exportObj.payload.locales = locales.filter(
        loc => !this.removeLocs.includes(loc.code)
      )
    }
  }
}
