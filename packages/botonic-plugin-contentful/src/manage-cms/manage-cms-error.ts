import { Stream } from 'stream'

import {
  AssetId,
  AssetInfo,
  ContentfulExceptionWrapper,
  ContentId,
  ContentType,
  ResourceId,
} from '../cms'
import * as nlp from '../nlp'
import { Locale } from '../nlp'
import { ContentFieldType } from './fields'
import { FieldsValues, ManageCms } from './manage-cms'
import { ManageContext } from './manage-context'

export class ErrorReportingManageCms implements ManageCms {
  exceptionWrapper = new ContentfulExceptionWrapper('ManageCms')

  constructor(
    readonly manageCms: ManageCms,
    readonly logErrors = true
  ) {}

  updateFields(
    context: ManageContext,
    contentId: ContentId,
    fields: FieldsValues
  ): Promise<FieldsValues> {
    return this.manageCms
      .updateFields(context, contentId, fields)
      .catch(this.handleError('updateFields', context, contentId, fields))
  }

  deleteContent(context: ManageContext, contentId: ContentId): Promise<void> {
    return this.manageCms
      .deleteContent(context, contentId)
      .catch(this.handleError('deleteContent', undefined, contentId, {}))
  }

  async createContent(
    context: ManageContext,
    model: ContentType,
    id: string
  ): Promise<void> {
    return this.manageCms
      .createContent(context, model, id)
      .catch(
        this.handleError(
          'createContent',
          undefined,
          new ContentId(model, id),
          {}
        )
      )
  }

  copyField(
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

  createAsset(
    context: ManageContext,
    file: string | ArrayBuffer | Stream,
    info: AssetInfo
  ): Promise<{ id: string; url?: string }> {
    return this.manageCms
      .createAsset(context, file, info)
      .catch(this.handleError('createAsset', undefined, undefined, {}))
  }

  removeAsset(context: ManageContext, assetId: AssetId): Promise<void> {
    return this.manageCms
      .removeAsset(context, assetId)
      .catch(this.handleError('removeAsset', undefined, assetId, {}))
  }
}
