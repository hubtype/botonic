import * as cms from '../cms'
import { ManageContext } from './manage-context'
import { ContentId } from '../cms'
import * as nlp from '../nlp'
import { ContentFieldType } from './fields'

export interface ManageCms {
  updateField<T extends cms.Content>(
    context: ManageContext,
    contentId: ContentId,
    fieldType: ContentFieldType,
    value: any
  ): Promise<void>

  copyField<T extends cms.Content>(
    context: ManageContext,
    contentId: ContentId,
    field: ContentFieldType,
    fromLocale: nlp.Locale
  ): Promise<void>
}
