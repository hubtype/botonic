import { Context, isSameModel, TopContentType } from '../cms'
import * as contentful from 'contentful'
import { ContentfulEntryUtils, DeliveryApi } from './delivery-api'

export abstract class ContentDelivery {
  constructor(
    readonly modelType: ContentType,
    protected readonly delivery: DeliveryApi,
    protected readonly resumeErrors: boolean
  ) {}

  protected logOrThrow(doing: string, reason: any) {
    if (this.resumeErrors) {
      console.error(`ERROR: ${doing}:`)
      return
    }
    throw new CmsException(doing, reason)
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
