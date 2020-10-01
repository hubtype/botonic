import {
  CmsException,
  Content,
  ContentType,
  Context,
  isSameModel,
} from '../cms'
import * as contentful from 'contentful'
import { Entry } from 'contentful'
import { ContentfulEntryUtils, DeliveryApi } from './delivery-api'
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

  urlFromAssetOptional(assetField?: contentful.Asset): string | undefined {
    if (!assetField) {
      return undefined
    }
    if (!assetField.fields.file) {
      this.logOrThrow(`found empty asset. Missing localization?`, undefined)
      return undefined
    }

    return this.urlFromAssetRequired(assetField)
  }

  protected logOrThrow(doing: string, reason: any) {
    if (this.resumeErrors) {
      console.error(`ERROR: ${doing}:`)
      return
    }
    throw new CmsException(doing, reason)
  }

  protected asyncMap<T extends Content>(
    context: Context,
    entries: Entry<any>[],
    factory: (entry: Entry<any>) => Promise<T>
  ): Promise<T[]> {
    return asyncMap(context, entries, factory, undefined, (entry, e) => {
      this.logOrThrow(`Loading ${entry.sys.type} '${entry.sys.id}'`, e)
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
}

export abstract class TopContentDelivery extends ContentDelivery {
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
}
