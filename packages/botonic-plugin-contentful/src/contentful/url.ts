import * as model from '../cms/model';
import * as contentful from 'contentful';
import { Delivery } from './delivery';

export class Url {
  constructor(readonly delivery: Delivery) {}

  async url(id: string): Promise<model.Url> {
    let entry: contentful.Entry<UrlFields> = await this.delivery.getEntry(id);
    return new model.Url(entry.fields.url);
  }
}

export interface UrlFields {
  url: string;
}
