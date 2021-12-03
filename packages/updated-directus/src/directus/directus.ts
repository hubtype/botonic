import { Stream } from 'stream'
import * as cms from '../cms'
import {
  AssetInfo,
  Button,
  Carousel,
  Content,
  ContentId,
  Handoff,
  Image,
  Payload,
  Queue,
  ScheduleContent,
  Text,
  Url,
} from '../cms'
import { DirectusOptions } from '../plugin'
import { ButtonDelivery } from './contents/button'
import { CarouselDelivery } from './contents/carousel'
import { HandoffDelivery } from './contents/handoff'
import { ImageDelivery } from './contents/image'
import { PayloadDelivery } from './contents/payload'
import { QueueDelivery } from './contents/queue'
import { ScheduleDelivery } from './contents/schedule'
import { TextDelivery } from './contents/text'
import { UrlDelivery } from './contents/url'
import { DirectusClient } from './delivery/directus-client'
import { ContentsDelivery } from './manage/contents'
import {
  CarouselFields,
  ElementFields,
  HandoffFields,
  PayloadFields,
  TextFields,
  UrlFields,
  QueueFields
} from './manage/directus-contents'
import { LocalesDelivery } from './manage/locales'
import { KeywordsDelivery } from './search/keywords'

export class Directus implements cms.CMS {
  private readonly _text: TextDelivery
  private readonly _button: ButtonDelivery
  private readonly _url: UrlDelivery
  private readonly _payload: PayloadDelivery
  private readonly _carousel: CarouselDelivery
  private readonly _image: ImageDelivery
  private readonly _keywords: KeywordsDelivery
  private readonly _contents: ContentsDelivery
  private readonly _locales: LocalesDelivery
  private readonly _schedule: ScheduleDelivery
  private readonly _queue: QueueDelivery
  private readonly _handoff: HandoffDelivery

  constructor(opt: DirectusOptions) {
    const client = new DirectusClient(opt)
    this._button = new ButtonDelivery(client)
    this._url = new UrlDelivery(client)
    this._payload = new PayloadDelivery(client)
    this._schedule = new ScheduleDelivery(client)
    this._queue = new QueueDelivery(client, this._schedule)
    this._handoff = new HandoffDelivery(client, this._queue)
    this._image = new ImageDelivery(client)
    this._carousel = new CarouselDelivery(client, this._button)
    this._text = new TextDelivery(
      client,
      this._button,
      this._image,
      this._carousel
    )
    this._keywords = new KeywordsDelivery(client)
    const deliveries = {
      [cms.ContentType.TEXT]: this._text,
      [cms.ContentType.IMAGE]: this._image,
      [cms.ContentType.CAROUSEL]: this._carousel,
      [cms.ContentType.URL]: this._url,
      [cms.ContentType.PAYLOAD]: this._payload,
      [cms.ContentType.QUEUE]: this._queue,
      [cms.ContentType.HANDOFF]: this._handoff,
      [cms.ContentType.SCHEDULE]: this._schedule,
      [cms.ContentType.BUTTON]: this._button,
    }
    this._contents = new ContentsDelivery(client, deliveries)
    this._locales = new LocalesDelivery(client)
  }

  async text(id: string, context: cms.SupportedLocales): Promise<Text> {
    return this._text.text(id, context)
  }
  async button(id: string, context: cms.SupportedLocales): Promise<Button> {
    return this._button.button(id, context)
  }
  async image(id: string, context: cms.SupportedLocales): Promise<Image> {
    return this._image.image(id, context)
  }
  async url(id: string, context: cms.SupportedLocales): Promise<Url> {
    return this._url.url(id, context)
  }

  async payload(id: string, context: cms.SupportedLocales): Promise<Payload> {
    return this._payload.payload(id, context)
  }

  async queue(id: string, context: cms.SupportedLocales): Promise<Queue> {
    return this._queue.queue(id, context)
  }

  async handoff(id: string, context: cms.SupportedLocales): Promise<Handoff> {
    return this._handoff.handoff(id, context)
  }

  async schedule(
    id: string,
    context: cms.SupportedLocales
  ): Promise<ScheduleContent> {
    return this._schedule.schedule(id, context)
  }

  async carousel(id: string, context: cms.SupportedLocales): Promise<Carousel> {
    return this._carousel.carousel(id, context)
  }

  async contentsWithKeywords(input: string): Promise<string[]> {
    return this._keywords.contentsWithKeywords(input)
  }
  async topContents(
    contentType: cms.MessageContentType,
    context: cms.SupportedLocales
  ): Promise<Content[]> {
    return this._contents.topContents(contentType, context)
  }
  async deleteContent(contentId: ContentId): Promise<void> {
    await this._contents.deleteContent(contentId)
  }

  async createContent(contentId: ContentId): Promise<void> {
    await this._contents.createContent(contentId)
  }

  async updateUrlFields(
    context: cms.SupportedLocales,
    id: string,
    fields: UrlFields,
    applyToAllLocales: boolean = true
  ): Promise<void> {
    await this._contents.updateUrlFields(context, id, fields, applyToAllLocales)
  }

  async updateQueueFields(
    context: cms.SupportedLocales,
    id: string,
    fields: QueueFields,
    applyToAllLocales: boolean = true
  ): Promise<void> {
    await this._contents.updateQueueFields(context, id, fields, applyToAllLocales)
  }

  async updatePayloadFields(
    context: cms.SupportedLocales,
    id: string,
    fields: PayloadFields,
    applyToAllLocales: boolean = true
  ): Promise<void> {
    await this._contents.updatePayloadFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async updateTextFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields,
    applyToAllLocales: boolean = true
  ): Promise<void> {
    await this._contents.updateTextFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async updateButtonFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields,
    applyToAllLocales: boolean = true
  ): Promise<void> {
    await this._contents.updateButtonFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async updateImageFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields,
    applyToAllLocales: boolean = true
  ): Promise<void> {
    await this._contents.updateImageFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async updateCarouselFields(
    context: cms.SupportedLocales,
    id: string,
    fields: CarouselFields,
    applyToAllLocales: boolean = true
  ) {
    await this._contents.updateCarouselFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async updateElementFields(
    context: cms.SupportedLocales,
    id: string,
    fields: ElementFields,
    applyToAllLocales: boolean = true
  ) {
    await this._contents.updateElementFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async updateHandoffFields(
    context: cms.SupportedLocales,
    id: string,
    fields: HandoffFields,
    applyToAllLocales: boolean = true
  ): Promise<void> {
    await this._contents.updateHandoffFields(
      context,
      id,
      fields,
      applyToAllLocales
    )
  }

  async createAsset(
    file: string | ArrayBuffer | Stream,
    info?: AssetInfo
  ): Promise<void> {
    await this._contents.createAsset(file, info)
  }

  async getLocales(): Promise<cms.SupportedLocales[]> {
    return await this._locales.getLocales()
  }

  async removeLocales(locales: cms.SupportedLocales[]): Promise<void> {
    await this._locales.removeLocales(locales)
  }

  async addLocales(localesToBeAdded: cms.LocaleToBeAddedType[]): Promise<void> {
    await this._locales.addLocales(localesToBeAdded)
  }
}
