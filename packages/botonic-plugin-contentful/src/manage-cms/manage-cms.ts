import { ContentId } from '../cms'
import * as nlp from '../nlp'
import { Locale } from '../nlp'
import { ContentFieldType } from './fields'
import { ManageContext } from './manage-context'

/**
 * Take into account that if you request a content immediately after updating it
 * you might get the old version
 */
export interface ManageCms {
  /**
   * @deprecated should be implemented in CMS interface instead
   */
  getDefaultLocale(): Promise<Locale>

  updateFields(
    context: ManageContext,
    contentId: ContentId,
    fields: { [contentFieldType: string]: any }
  ): Promise<void>

  /** Will not fail if source does not have this field */
  copyField(
    context: ManageContext,
    contentId: ContentId,
    field: ContentFieldType,
    fromLocale: nlp.Locale,
    onlyIfTargetEmpty: boolean
  ): Promise<void>

  copyAssetFile(
    context: ManageContext,
    assetId: string,
    fromLocale: nlp.Locale
  ): Promise<void>

  removeAssetFile(context: ManageContext, assetId: string): Promise<void>
}
