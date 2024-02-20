import assert from 'assert'
// eslint-disable-next-line node/no-missing-import
import { LocaleProps } from 'contentful-management/dist/typings/entities/locale'

import { I18nFieldValues, SpaceExport } from './space-export'

/**
 * Useful to clone the contents flow from a space when the target locales are different.
 */
export class LocaleMigrator {
  defaultLoc: string | undefined
  /**
   * @param fromLoc The locale whose flow we want to maintain
   * @param toLoc The locale in which `fromLoc`'s flow will be converted
   */
  constructor(
    readonly fromLoc: string,
    readonly toLoc: string,
    readonly verbose = false
  ) {}

  private getDefaultLocale(spaceExport: SpaceExport): string | undefined {
    if (spaceExport.payload.locales) {
      const fromLoc = spaceExport.getLocale(this.fromLoc)
      if (fromLoc && fromLoc.fallbackCode) {
        return fromLoc.fallbackCode
      }
      const defaultLoc = spaceExport.getDefaultLocale()
      if (defaultLoc) {
        return defaultLoc.code
      }
    }
    console.log(
      `I don't know fallback for ${this.fromLoc}. Assuming any available locale`
    )
    return undefined
  }

  migrate(spaceExport: SpaceExport): void {
    if (this.fromLoc == this.toLoc) {
      console.warn('Source and target locale are the same')
      return
    }
    this.defaultLoc = this.getDefaultLocale(spaceExport)
    this.migrateAssets(spaceExport)
    this.migrateEntries(spaceExport)
    this.migrateLocales(spaceExport)
  }

  private migrateEntries(spaceExport: SpaceExport): void {
    for (const entry of spaceExport.payload.entries) {
      for (const fieldName of Object.getOwnPropertyNames(entry.fields)) {
        try {
          const vals = entry.fields[fieldName] as I18nFieldValues
          if (this.verbose) {
            console.log(`Migrating entry ${entry.sys.id}.${fieldName}`)
          }
          this.migrateField(vals)
        } catch (e) {
          const cause = e as Error
          throw Error(
            `converting entry ${
              entry.sys.id
            } field '${fieldName}': ${cause.toString()}`
          )
        }
      }
    }
  }

  private migrateAssets(spaceExport: SpaceExport): void {
    if (!spaceExport.payload.assets) {
      return
    }
    for (const asset of spaceExport.payload.assets) {
      for (const fieldName of Object.getOwnPropertyNames(asset.fields)) {
        try {
          const vals = (asset.fields as any)[fieldName] as I18nFieldValues
          if (this.verbose) {
            console.log(`Migrating asset ${asset.sys.id}.${fieldName}`)
          }
          this.migrateField(vals)
        } catch (e) {
          const cause = e as Error
          throw Error(
            `converting asset ${
              asset.sys.id
            } field '${fieldName}': ${cause.toString()}`
          )
        }
      }
    }
  }

  private migrateField(values: I18nFieldValues): void {
    let value = values[this.fromLoc]
    if (!value) {
      // TODO also get it if language being removed
      if (this.defaultLoc && this.defaultLoc == this.fromLoc) {
        value = values[this.defaultLoc]
      }
    }
    if (!(this.toLoc in values)) {
      values[this.toLoc] = value
    }
    delete values[this.fromLoc]
  }

  private migrateLocales(spaceExport: SpaceExport) {
    let locales = spaceExport.payload.locales
    if (locales) {
      const fromLoc = spaceExport.getLocale(this.fromLoc)
      assert(fromLoc)
      const toLoc = spaceExport.getLocale(this.toLoc)
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
          // @ts-ignore
          toLoc.fallbackCode = null
        }
      } else {
        fromLoc.code = this.toLoc
        fromLoc.name = this.toLoc
      }
      spaceExport.payload.locales = locales
    }
  }
}

export class LocaleRemover {
  /**
   * @param removeLocs The locales to completely remove
   */
  constructor(
    readonly removeLocs: string[],
    readonly newDefault?: string
  ) {}

  remove(spaceExport: SpaceExport): void {
    this.removeEntries(spaceExport)
    this.removeAssets(spaceExport)
    this.removeLocales(spaceExport)
  }

  private removeEntries(spaceExport: SpaceExport): void {
    const defaultLoc = spaceExport.getDefaultLocale()
    for (const entry of spaceExport.payload.entries) {
      for (const fieldName of Object.getOwnPropertyNames(entry.fields)) {
        const vals = entry.fields[fieldName] as I18nFieldValues
        this.removeField(vals, defaultLoc)
      }
    }
  }

  private removeAssets(spaceExport: SpaceExport): void {
    if (!spaceExport.payload.assets) {
      return
    }
    const defaultLoc = spaceExport.getDefaultLocale()
    for (const assets of spaceExport.payload.assets) {
      for (const fieldName of Object.getOwnPropertyNames(assets.fields)) {
        const vals = (assets.fields as any)[fieldName] as I18nFieldValues
        this.removeField(vals, defaultLoc)
      }
    }
  }

  private removeField(vals: I18nFieldValues, defaultLoc?: LocaleProps) {
    for (const loc of this.removeLocs) {
      if (
        this.newDefault &&
        vals[this.newDefault] == undefined &&
        vals[loc] != undefined &&
        defaultLoc?.code == loc
      ) {
        vals[this.newDefault] = vals[loc]
      }
      delete vals[loc]
    }
  }

  private removeLocales(spaceExport: SpaceExport) {
    if (!spaceExport.payload.locales) {
      return
    }
    for (const removeLoc of this.removeLocs) {
      if (!spaceExport.getLocale(removeLoc)) {
        console.error(`Expecting to remove locale ${removeLoc} but not found`)
        continue
      }
      for (const loc of spaceExport.payload.locales) {
        if (this.removeLocs.includes(loc.code)) {
          continue
        }
        if (loc.fallbackCode == removeLoc) {
          console.log(`Fallback for ${loc.code} is now invalid. Please edit it`)
        }
      }
    }
    spaceExport.payload.locales = spaceExport.payload.locales.filter(
      loc => !this.removeLocs.includes(loc.code)
    )
    for (const loc of spaceExport.payload.locales) {
      if (this.newDefault && loc.code == this.newDefault) {
        loc.default = true
        // @ts-ignore
        loc.fallbackCode = null
        loc.optional = false
      }
    }
  }
}
