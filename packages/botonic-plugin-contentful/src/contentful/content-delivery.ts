import {
  AssetId,
  CmsException,
  Content,
  ContentId,
  ContentType,
  Context,
  isSameModel,
  ResourceId,
} from '../cms'
import * as contentful from 'contentful'
import { Entry } from 'contentful'
import {
  ContentfulEntryUtils,
  ContentWithNameFields,
  DeliveryApi,
} from './delivery-api'
import { asyncMap } from '../util/async'

export abstract class ResourceDelivery {
  constructor(
    protected readonly delivery: DeliveryApi,
    protected readonly resumeErrors: boolean
  ) {}

  urlFromAssetRequired(assetField: contentful.Asset): string {
    if (!assetField.fields.file) {
      throw new CmsException(
        `found empty ${assetField.sys.type} asset. Missing localization?`
      )
    }
    return 'https:' + assetField.fields.file.url
  }

  urlFromAssetOptional(
    assetField: contentful.Asset | undefined = undefined,
    context: Context
  ): string | undefined {
    if (!assetField) {
      return undefined
    }
    if (!assetField.fields.file) {
      this.logOrThrow(
        `found empty asset. Missing localization?`,
        context,
        undefined,
        new AssetId(assetField.sys.id, assetField.sys.type)
      )
      return undefined
    }

    return this.urlFromAssetRequired(assetField)
  }

  protected checkEntry(entry: Entry<any>) {
    if (entry.fields == undefined) {
      throw new CmsException(`Broken reference? Not published?`)
    }
  }

  protected logOrThrow(
    doing: string,
    context: Context,
    reason: any,
    resourceId: ResourceId
  ) {
    if (this.resumeErrors) {
      console.error(
        `ERROR: ${doing} on locale '${String(
          context.locale
        )}'. Returning content with partial data.`
      )
      return
    }
    throw new CmsException(doing, reason, resourceId)
  }

  protected asyncMap<T extends Content>(
    context: Context,
    entries: Entry<any>[],
    factory: (entry: Entry<any>) => Promise<T>
  ): Promise<T[]> {
    return asyncMap(context, entries, factory, undefined, (entry, e) => {
      const contentId = ContentfulEntryUtils.getContentId(entry)
      this.logOrThrow(
        `Loading ${contentId.toString()}`,
        context,
        e,
        new ContentId(contentId.model, entry.sys.id)
      )
      return undefined
    })
  }
}

export abstract class ContentDelivery extends ResourceDelivery {
  constructor(
    readonly modelType: ContentType,
    delivery: DeliveryApi,
    resumeErrors: boolean
  ) {
    super(delivery, resumeErrors)
  }

  async getEntry<T>(
    id: string,
    context: Context,
    query: any = {}
  ): Promise<contentful.Entry<T>> {
    const entry = await this.delivery.getEntry<T>(id, context, query)
    const gotType = ContentfulEntryUtils.getContentModel(entry)
    if (!isSameModel(gotType, this.modelType)) {
      throw new Error(
        `Requested model with id '${id}' of type '${this.modelType}' but got '${gotType}'`
      )
    }
    return entry
  }

  entryId(entry: Entry<ContentWithNameFields>): string {
    return entry.fields.name + '/' + entry.sys.id
  }
}

export abstract class TopContentDelivery extends ContentDelivery {}
