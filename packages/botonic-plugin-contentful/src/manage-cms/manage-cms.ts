import * as cms from '../cms'
import { ManageContext } from './manage-context'
import { ContentId } from '../cms'
import * as nlp from '../nlp'
import { ContentFieldType } from './fields'
import { Locale } from '../nlp'

/**
 * Take into account that if you request a content immediately after updating it
 * you might get the old version
 */
export interface ManageCms {
  /**
   * @deprecated should be implemented in CMS interface instead
   */
  getDefaultLocale(): Promise<Locale>

  updateField<T extends cms.Content>(
    context: ManageContext,
    contentId: ContentId,
    fieldType: ContentFieldType,
    value: any
  ): Promise<void>

  /** Will not fail if source does not have this field */
  copyField<T extends cms.Content>(
    context: ManageContext,
    contentId: ContentId,
    field: ContentFieldType,
    fromLocale: nlp.Locale,
    onlyIfTargetEmpty: boolean
  ): Promise<void>
}
