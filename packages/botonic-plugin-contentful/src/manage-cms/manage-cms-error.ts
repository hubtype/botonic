import * as cms from '../cms'
import { ContentfulExceptionWrapper, ContentId, ResourceId } from '../cms'
import * as nlp from '../nlp'
import { Locale } from '../nlp'
import { ContentFieldType } from './fields'
import { FieldsValues, ManageCms } from './manage-cms'
import { ManageContext } from './manage-context'

export class ErrorReportingManageCms implements ManageCms {
  exceptionWrapper = new ContentfulExceptionWrapper('ManageCms')

  constructor(readonly manageCms: ManageCms, readonly logErrors = true) {}

  updateFields<T extends cms.Content>(
    context: ManageContext,
    contentId: ContentId,
    fields: FieldsValues
  ): Promise<FieldsValues> {
    return this.manageCms
      .updateFields(context, contentId, fields)
      .catch(this.handleError('updateFields', context, contentId))
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
      .catch(this.handleError('copyField', context, contentId))
  }

  private handleError(
    method: string,
    context?: ManageContext,
    resourceId?: ResourceId
  ): (reason: any) => never {
    return (reason: any) => {
      throw this.exceptionWrapper.wrap(reason, method, resourceId, context)
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
