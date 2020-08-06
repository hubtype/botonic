import * as cms from '../cms'
import { ContentfulExceptionWrapper, ContentId } from '../cms'
import { ManageCms } from './manage-cms'
import { ManageContext } from './manage-context'
import * as nlp from '../nlp'
import { ContentFieldType } from './fields'
import { Locale } from '../nlp'

export class ErrorReportingManageCms implements ManageCms {
  exceptionWrapper = new ContentfulExceptionWrapper('ManageCms')

  constructor(readonly manageCms: ManageCms, readonly logErrors = true) {}

  updateField<T extends cms.Content>(
    context: ManageContext,
    contentId: ContentId,
    fieldType: ContentFieldType,
    value: any
  ): Promise<void> {
    return this.manageCms
      .updateField(context, contentId, fieldType, value)
      .catch(this.handleError('updateField', contentId))
  }

  copyField<T extends cms.Content>(
    context: ManageContext,
    contentId: ContentId,
    field: ContentFieldType,
    fromLocale: nlp.Locale,
    onlyIfTargetEmpty: boolean
  ): Promise<void> {
    return this.manageCms
      .copyField(context, contentId, field, fromLocale, onlyIfTargetEmpty)
      .catch(this.handleError('copyField', contentId))
  }

  private handleError(
    method: string,
    contentId?: ContentId
  ): (reason: any) => never {
    return (reason: any) => {
      throw this.exceptionWrapper.wrap(
        reason,
        method,
        contentId?.model,
        contentId?.id
      )
    }
  }

  getDefaultLocale(): Promise<Locale> {
    return this.manageCms
      .getDefaultLocale()
      .catch(this.handleError('defaultLocale'))
  }

  copyAssetFile(
    context: ManageContext,
    assetId: string,
    fromLocale: Locale
  ): Promise<void> {
    return this.manageCms
      .copyAssetFile(context, assetId, fromLocale)
      .catch(this.handleError('copyAssetFile'))
  }

  removeAssetFile(context: ManageContext, assetId: string): Promise<void> {
    return this.manageCms
      .removeAssetFile(context, assetId)
      .catch(this.handleError('removeAssetFile'))
  }
}
