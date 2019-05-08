import { ModelType } from '../cms';
import * as contentful from 'contentful';

export interface DeliveryApi {
  getEntryByIdOrName<T>(
    id: string,
    contentType: ModelType
  ): Promise<contentful.Entry<T>>;

  getEntry<T>(id: string): Promise<contentful.Entry<T>>;
}

export function getContentModel<T>(entry: contentful.Entry<T>): ModelType {
  // https://blog.oio.de/2014/02/28/typescript-accessing-enum-values-via-a-string/
  const typ = entry.sys.contentType.sys.id;
  return typ as ModelType;
}
