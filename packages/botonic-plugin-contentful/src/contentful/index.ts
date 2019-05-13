import { KeywordsDelivery } from './keywords';
import { FollowUpDelivery } from './followUp';
import { ButtonsWithKeywords, CallbackMap } from '../cms';
import { ButtonDelivery } from './button';
import { DeliveryApi } from './deliveryApi';
import { CarouselDelivery } from './carousel';
import { TextDelivery } from './text';
import { UrlDelivery } from './url';
import * as cms from '../cms';

export default class Contentful implements cms.CMS {
  _carousel: CarouselDelivery;

  _text: TextDelivery;

  _url: UrlDelivery;

  _keywords: KeywordsDelivery;

  constructor(spaceId: string, accessToken: string, timeoutMs: number = 30000) {
    let delivery = new DeliveryApi(spaceId, accessToken, timeoutMs);
    let button = new ButtonDelivery(delivery);
    this._carousel = new CarouselDelivery(delivery, button);
    this._text = new TextDelivery(delivery, button);
    this._url = new UrlDelivery(delivery);
    let followUp = new FollowUpDelivery(this._carousel, this._text);
    [this._text, this._url, this._carousel].forEach(d =>
      d.setFollowUp(followUp)
    );
    this._keywords = new KeywordsDelivery(delivery);
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

  async textsWithKeywordsAsButtons(): Promise<ButtonsWithKeywords[]> {
    return this._keywords.textsWithKeywordsAsButtons();
  }
}

export { DeliveryApi } from './deliveryApi';
export { CarouselDelivery } from './carousel';
export { ModelType } from '../cms';
