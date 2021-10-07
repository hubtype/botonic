import * as cms from '../cms'
import { TextDelivery } from './contents/text'
import { ButtonDelivery } from './contents/button'
import { ImageDelivery } from './contents/image'
import { KeywordsDelivery } from './search/keywords'
import { DirectusClient } from './delivery/directus-client'
import { Button, Text, Image, Content, AssetInfo, Url, Carousel } from '../cms'
import { DirectusOptions } from '../plugin'
import { ContentsDelivery } from './manage/contents'
import { TextFields } from './manage/directus-contents'
import { Stream } from 'stream'
import { UrlDelivery } from './contents/url'
import { CarouselDelivery } from './contents/carousel'

export class Directus implements cms.CMS {
  private readonly _text: TextDelivery
  private readonly _button: ButtonDelivery
  private readonly _url: UrlDelivery
  private readonly _carousel: CarouselDelivery
  private readonly _image: ImageDelivery
  private readonly _keywords: KeywordsDelivery
  private readonly _contents: ContentsDelivery

  constructor(opt: DirectusOptions) {
    const client = new DirectusClient(opt)
    this._button = new ButtonDelivery(client)
    this._url = new UrlDelivery(client)
    this._image = new ImageDelivery(client)
    this._text = new TextDelivery(client, this._button, this._image)
    this._carousel = new CarouselDelivery(client, this._button)
    this._keywords = new KeywordsDelivery(client)
    const deliveries = {
      [cms.ContentType.TEXT]: this._text,
      [cms.ContentType.IMAGE]: this._image,
      [cms.ContentType.CAROUSEL]: this._carousel,
    }
    this._contents = new ContentsDelivery(client, deliveries)
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
  async deleteContent(
    context: cms.SupportedLocales,
    contentType: cms.ContentType,
    id: string
  ): Promise<void> {
    await this._contents.deleteContent(context, contentType, id)
  }

  async createContent(
    context: cms.SupportedLocales,
    contentType: cms.ContentType,
    id: string
  ): Promise<void> {
    await this._contents.createContent(context, contentType, id)
  }

  async updateTextFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields
  ): Promise<void> {
    await this._contents.updateTextFields(context, id, fields)
  }

  async updateButtonFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields
  ): Promise<void> {
    await this._contents.updateButtonFields(context, id, fields)
  }

  async updateImageFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields
  ): Promise<void> {
    await this._contents.updateImageFields(context, id, fields)
  }

  async createAsset(
    context: cms.SupportedLocales,
    file: string | ArrayBuffer | Stream,
    info: AssetInfo
  ): Promise<void> {
    await this._contents.createAsset(context, file, info)
  }
}
