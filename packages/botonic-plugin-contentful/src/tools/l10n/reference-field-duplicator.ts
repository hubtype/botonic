import * as cms from '../../cms'
import { AssetId, CMS, ContentId, ContentType } from '../../cms'
import { ContentFieldType, ManageCms, ManageContext } from '../../manage-cms'
import { asyncEach } from '../../util/async'

/**
 * TODO duplicate non-text fields which don't have fallback
 * instead of harcoding them.
 * Does not duplicate CommonFields.followup
 * Only duplicates if target field is empty
 */
export class ReferenceFieldDuplicator {
  constructor(
    readonly cms: CMS,
    readonly manageCms: ManageCms,
    readonly manageContext: ManageContext
  ) {}

  async duplicateReferenceFields(): Promise<void> {
    const defaultLocale = await this.manageCms.getDefaultLocale()
    const fields: { [type: string]: ContentFieldType[] } = {
      [ContentType.TEXT]: [ContentFieldType.BUTTONS],
      [ContentType.STARTUP]: [ContentFieldType.BUTTONS],
      [ContentType.ELEMENT]: [ContentFieldType.IMAGE],
    }
    for (const contentType of Object.keys(fields)) {
      console.log(`***Duplicating reference field of type '${contentType}'`)
      for (const fieldType of fields[contentType]) {
        console.log(` **Duplicating '${contentType}' fields`)
        await this.duplicate(
          defaultLocale,
          contentType as ContentType,
          fieldType
        )
      }
    }
    this.warning()
  }

  async duplicateAssetFiles() {
    const defaultLocale = await this.manageCms.getDefaultLocale()
    console.log(`***Duplicating assets`)
    const assets = await this.cms.assets({ locale: defaultLocale })
    console.log(` **Duplicating ${assets.length} assets`)
    for (const a of assets) {
      await this.manageCms.copyAssetFile(
        this.manageContext,
        new AssetId(a.id, undefined),
        defaultLocale
      )
    }
    this.warning()
  }

  private warning() {
    if (this.manageContext.preview) {
      console.warn('Remember to publish the entries from contentful.com')
    }
  }

  private async duplicate(
    defaultLocale: string,
    contentType: cms.ContentType,
    field: ContentFieldType
  ) {
    const contents = await this.cms.contents(contentType, {
      ...this.manageContext,
      locale: defaultLocale,
    })
    await asyncEach({ concurrency: 5 }, contents, async content => {
      console.log(`  *Duplicating ${content.id} (${content.name})`)
      await this.manageCms.copyField(
        this.manageContext,
        ContentId.create(contentType, content.id),
        field,
        defaultLocale,
        true
      )
    })
  }
}
