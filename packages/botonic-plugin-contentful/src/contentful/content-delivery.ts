import { Context, isSameModel, ModelType } from '../cms';
import * as contentful from 'contentful';
import { DeliveryApi } from './delivery-api';

export abstract class ContentDelivery {
  constructor(
    readonly modelType: ModelType,
    protected readonly delivery: DeliveryApi
  ) {}

  async getEntry<T>(
    id: string,
    context: Context,
    query: any = {}
  ): Promise<contentful.Entry<T>> {
    let entry = await this.delivery.getEntry<T>(
      id,
      context,
      query
    );
    let gotType = DeliveryApi.getContentModel(entry);
    if (!isSameModel(gotType, this.modelType)) {
      throw new Error(
        `Requested model of type '${this.modelType}' but got '${gotType}'`
      );
    }
    return entry;
  }
}
