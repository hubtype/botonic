import { CallbackMap } from '../cms';
import { Button } from './button';
import { Delivery } from './delivery';
import { Carousel } from './carousel';
import { Text } from './text';
import { Url } from './url';
import * as cms from '../cms';

export default class Contentful implements cms.CMS {
  _carousel: Carousel;

  _text: Text;

  _url: Url;

  constructor(spaceId: string, accessToken: string, timeoutMs: number = 30000) {
    let delivery = new Delivery(spaceId, accessToken, timeoutMs);
    let button = new Button(delivery);
    this._carousel = new Carousel(delivery, button);
    this._text = new Text(delivery, button);
    this._url = new Url(delivery);
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

export { Delivery } from './delivery';
export { Carousel } from './carousel';
export { ModelType } from '../cms';
