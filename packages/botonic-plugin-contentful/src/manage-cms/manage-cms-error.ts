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
      .updateField<T>(context, contentId, fieldType, value)
      .catch(this.handleError('updateField', contentId))
  }

  copyField<T extends cms.Content>(
    context: ManageContext,
    contentId: ContentId,
    field: ContentFieldType,
    fromLocale: nlp.Locale
  ): Promise<void> {
    return this.manageCms
      .copyField<T>(context, contentId, field, fromLocale)
      .catch(this.handleError('copyField', contentId))
  }

  private handleError(
    method: string,
    contentId: ContentId
  ): (reason: any) => never {
    return (reason: any) => {
      throw this.exceptionWrapper.wrap(
        reason,
        method,
        contentId.model,
        contentId.id
      )
    }
  }

  getDefaultLocale(): Promise<Locale> {
    return this.manageCms
      .getDefaultLocale()
      .catch(this.handleError('defaultLocale'))
  }
}
