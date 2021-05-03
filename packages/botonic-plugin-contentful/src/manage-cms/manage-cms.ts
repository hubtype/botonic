import { AssetId, ContentId, ContentType } from '../cms'
import * as nlp from '../nlp'
import { ContentFieldType } from './fields'
import { ManageContext } from './manage-context'

export interface FieldsValues {
  /**
   * If the field has a fallback locale, after a undefined/null value is set,
   * the fallback locale's value will be delivered. However, if a '' is set,
   * an empty string will be delivered.
   */
  [contentFieldType: string]: any
}

/**
 * Take into account that if you request a content immediately after updating it
 * you might get the old version
 */
export interface ManageCms {
  updateFields(
    context: ManageContext,
    contentId: ContentId,
    fields: FieldsValues
  ): Promise<FieldsValues>

  /** TODO: Content will never be published, because it doesn't have fields yet */
  createContent(
    context: ManageContext,
    model: ContentType,
    id: string
  ): Promise<void>

  /**
   * @param context: Content will be deleted even if preview is true
   */
  deleteContent(context: ManageContext, contentId: ContentId): Promise<void>

  /**
   * Will not fail if source does not have this field set
   * onlyIfTargetEmpty: set to true to avoid overwriting existing data (it will not throw)
   * */
  copyField(
    context: ManageContext,
    contentId: ContentId,
    field: ContentFieldType,
    fromLocale: nlp.Locale,
    onlyIfTargetEmpty: boolean
  ): Promise<void>

  copyAssetFile(
    context: ManageContext,
    assetId: AssetId,
    fromLocale: nlp.Locale
  ): Promise<void>

  removeAssetFile(context: ManageContext, assetId: AssetId): Promise<void>
}
