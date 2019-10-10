import { DEFAULT_CONTEXT, Context } from '../cms/context';
import { SearchResult } from '../search';
import { AssetDelivery } from './asset';
import { DateRangeDelivery } from './date-range';
import { ImageDelivery } from './image';
import { ScheduleDelivery } from './schedule';
import { KeywordsDelivery } from './keywords';
import { FollowUpDelivery } from './follow-up';
import { CommonFields, Content, isMessageModel, ModelType } from '../cms';
import { ButtonDelivery } from './button';
import { DeliveryApi } from './delivery-api';
import { CarouselDelivery } from './carousel';
import { StartUpDelivery } from './startup';
import { TextDelivery } from './text';
import { UrlDelivery } from './url';
import * as cms from '../cms';
import * as time from '../time';
import { QueueDelivery } from './queue';
import * as contentful from 'contentful';

export default class Contentful implements cms.CMS {
  _delivery: DeliveryApi;
  _carousel: CarouselDelivery;
  _text: TextDelivery;
  _startUp: StartUpDelivery;
  _url: UrlDelivery;
  _keywords: KeywordsDelivery;
  _schedule: ScheduleDelivery;
  _dateRange: DateRangeDelivery;
  _image: ImageDelivery;
  _asset: AssetDelivery;
  _queue: QueueDelivery;

  constructor(spaceId: string, accessToken: string, timeoutMs: number = 30000) {
    const delivery = new DeliveryApi(spaceId, accessToken, timeoutMs);
    this._delivery = delivery;
    const button = new ButtonDelivery(delivery);
    this._carousel = new CarouselDelivery(delivery, button);
    this._text = new TextDelivery(delivery, button);
    this._startUp = new StartUpDelivery(delivery, button);
    this._url = new UrlDelivery(delivery);
    this._image = new ImageDelivery(delivery);
    this._asset = new AssetDelivery(delivery);
    this._queue = new QueueDelivery(delivery);
    const followUp = new FollowUpDelivery(this._carousel, this._text);
    [this._text, this._url, this._carousel].forEach(d =>
      d.setFollowUp(followUp)
    );
    this._keywords = new KeywordsDelivery(delivery);
    this._schedule = new ScheduleDelivery(delivery);
    this._dateRange = new DateRangeDelivery(delivery);
  }

  async carousel(id: string, context = DEFAULT_CONTEXT): Promise<cms.Carousel> {
    return this._carousel.carousel(id, context);
  }

  async text(id: string, context = DEFAULT_CONTEXT): Promise<cms.Text> {
    return this._text.text(id, context);
  }

  async startUp(id: string, context = DEFAULT_CONTEXT): Promise<cms.StartUp> {
    return this._startUp.startUp(id, context);
  }

  async url(id: string, context = DEFAULT_CONTEXT): Promise<cms.Url> {
    return this._url.url(id, context);
  }

  async queue(id: string, context = DEFAULT_CONTEXT): Promise<cms.Queue> {
    return this._queue.queue(id, context);
  }

  image(id: string, context = DEFAULT_CONTEXT): Promise<cms.Image> {
    return this._image.image(id, context);
  }

  chitchat(id: string, context = DEFAULT_CONTEXT): Promise<cms.Chitchat> {
    return this._text.text(id, context);
  }

  contents(
    model: ModelType,
    context = DEFAULT_CONTEXT,
    filter?: (cf: CommonFields) => boolean
  ): Promise<Content[]> {
    if (!isMessageModel(model)) {
      throw new Error(
        `contents() can only be used for message models but '${model}' is not`
      );
    }
    return this._delivery.contents(
      model,
      context,
      (entry: contentful.Entry<any>, ctxt: Context) =>
        this.fromEntry(entry, ctxt),
      filter
    );
  }

  async fromEntry(
    entry: contentful.Entry<any>,
    context: Context
  ): Promise<Content> {
    const model: ModelType = DeliveryApi.getContentModel(entry);
    switch (model) {
      case ModelType.CAROUSEL:
        return this._carousel.fromEntry(entry, context);
      case ModelType.QUEUE:
        return QueueDelivery.fromEntry(entry);
      case ModelType.CHITCHAT:
      case ModelType.TEXT:
        return this._text.fromEntry(entry, context);
      case ModelType.IMAGE:
        return ImageDelivery.fromEntry(entry);
      case ModelType.URL:
        return this._url.fromEntry(entry, context);
      case ModelType.STARTUP:
        return this._startUp.fromEntry(entry, context);
      default:
        throw new Error(`${model} is not a Content type`);
    }
  }

  async contentsWithKeywords(
    context = DEFAULT_CONTEXT
  ): Promise<SearchResult[]> {
    return this._keywords.contentsWithKeywords(context);
  }

  async schedule(id: string): Promise<time.Schedule> {
    return this._schedule.schedule(id);
  }

  asset(id: string): Promise<cms.Asset> {
    return this._asset.asset(id);
  }

  dateRange(id: string): Promise<time.DateRange> {
    return this._dateRange.dateRange(id);
  }
}

export { DeliveryApi } from './delivery-api';
export { CarouselDelivery } from './carousel';
