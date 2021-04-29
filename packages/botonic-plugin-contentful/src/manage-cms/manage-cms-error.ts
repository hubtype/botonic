import * as cms from '../cms'
import {
  AssetId,
  ContentfulExceptionWrapper,
  ContentId,
  ResourceId,
} from '../cms'
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
      .catch(this.handleError('updateFields', context, contentId, fields))
  }

  deleteEntry<T extends cms.Content>(contentId: ContentId): Promise<void> {
    return this.manageCms
      .deleteEntry(contentId)
      .catch(this.handleError('deleteEntry', undefined, contentId, {}))
  }

  createEntryWithId<T extends cms.Content>(
    contentId: ContentId
  ): Promise<void> {
    return this.manageCms
      .createEntryWithId(contentId)
      .catch(this.handleError('createEntryWithId', undefined, contentId, {}))
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
      .catch(
        this.handleError('copyField', context, contentId, {
          field,
          fromLocale,
          onlyIfTargetEmpty,
        })
      )
  }

  private handleError(
    method: string,
    context: ManageContext | undefined,
    resourceId: ResourceId | undefined,
    args: Record<string, any>
  ): (reason: any) => never {
    return (reason: any) => {
      throw this.exceptionWrapper.wrap(
        reason,
        method,
        resourceId,
        args,
        context
      )
    }
  }

  copyAssetFile(
    context: ManageContext,
    assetId: AssetId,
    fromLocale: Locale
  ): Promise<void> {
    return this.manageCms
      .copyAssetFile(context, assetId, fromLocale)
      .catch(
        this.handleError('copyAssetFile', context, assetId, { fromLocale })
      )
  }

  removeAssetFile(context: ManageContext, assetId: AssetId): Promise<void> {
    return this.manageCms
      .removeAssetFile(context, assetId)
      .catch(this.handleError('removeAssetFile', context, assetId, {}))
  }
}
