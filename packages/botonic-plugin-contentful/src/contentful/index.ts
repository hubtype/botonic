import * as contentful from 'contentful';
import { FollowUpDelivery } from './followUp';
import { CallbackMap } from '../cms';
import { ButtonDelivery } from './button';
import { CachedDeliveryApi } from './deliveryApiCache';
import { CarouselDelivery } from './carousel';
import { TextDelivery } from './text';
import { UrlDelivery } from './url';
import * as cms from '../cms';

export default class Contentful implements cms.CMS {
  _carousel: CarouselDelivery;

  _text: TextDelivery;

  _url: UrlDelivery;

  constructor(
    spaceId: string,
    accessToken: string,
    cacheTtlInMs: number = 10000
  ) {
    /**
     * ContentfulClientApi.timeoutMs does not work when there's no network during the first connection
     */
    let client = contentful.createClient({
      space: spaceId,
      accessToken: accessToken,
      timeout: 30000
    });
    let delivery = new CachedDeliveryApi(client, cacheTtlInMs);
    let button = new ButtonDelivery(delivery);
    this._carousel = new CarouselDelivery(delivery, button);
    this._text = new TextDelivery(delivery, button);
    this._url = new UrlDelivery(delivery);
    let followUp = new FollowUpDelivery(this._carousel, this._text);
    [this._text, this._url, this._carousel].forEach(d =>
      d.setFollowUp(followUp)
    );
  }

  async carousel(
    id: string,
    callbacks: cms.CallbackMap = new CallbackMap()
  ): Promise<cms.Carousel> {
    return this._carousel.carousel(id, callbacks);
  }

  async text(
    id: string,
    callbacks: cms.CallbackMap = new CallbackMap()
  ): Promise<cms.Text> {
    return this._text.text(id, callbacks);
  }

  async url(id: string): Promise<cms.Url> {
    return this._url.url(id);
  }
}

export { DeliveryApi } from './deliveryApi';
export { CarouselDelivery } from './carousel';
export { ModelType } from '../cms';
