import { Delivery } from './delivery';
import { Carousel } from './carousel';
import * as cms from '../cms';

export default class Contentful implements cms.CMS {
  _carousel: Carousel;

  constructor(spaceId: string, accessToken: string, timeoutMs: number = 30000) {
    let delivery = new Delivery(spaceId, accessToken, timeoutMs);
    this._carousel = new Carousel(delivery);
  }

  async carousel(
    id: string,
    callbacks: cms.CallbackMap
  ): Promise<cms.Carousel> {
    return this._carousel.carousel(id, callbacks);
  }
}

export { Delivery } from './delivery';
export { Carousel } from './carousel';
