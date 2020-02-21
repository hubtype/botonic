import { Context, isSameModel, TopContentType } from '../cms'
import * as contentful from 'contentful'
import { DeliveryApi } from './delivery-api'

export abstract class ContentDelivery {
  constructor(
    readonly modelType: TopContentType,
    protected readonly delivery: DeliveryApi
  ) {}

  async getEntry<T>(
    id: string,
    context: Context,
    query: any = {}
  ): Promise<contentful.Entry<T>> {
    const entry = await this.delivery.getEntry<T>(id, context, query)
    const gotType = DeliveryApi.getContentModel(entry)
    if (!isSameModel(gotType, this.modelType)) {
      throw new Error(
        `Requested model with id '${id}' of type '${this.modelType}' but got '${gotType}'`
      )
    }
    return entry
  }
}
