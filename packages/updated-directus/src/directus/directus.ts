import * as cms from '../cms'
import { TextDelivery } from './contents/text'
import { ButtonDelivery } from './contents/button'
import { ImageDelivery } from './contents/image'
import { KeywordsDelivery } from './search/keywords'
import { DirectusClient } from './delivery/directusClient'
import { Button, Text, Image, Content } from '../cms'
import { DirectusOptions } from '../plugin'
import { ContentsDelivery } from './manage/contents'

export class Directus implements cms.CMS {
  private readonly _text: TextDelivery
  private readonly _button: ButtonDelivery
  private readonly _image: ImageDelivery
  private readonly _keywords: KeywordsDelivery
  private readonly _contents: ContentsDelivery

  constructor(opt: DirectusOptions) {
    const client = new DirectusClient(opt)
    this._button = new ButtonDelivery(client)
    this._image = new ImageDelivery(client)
    this._text = new TextDelivery(client, this._button, this._image)
    this._keywords = new KeywordsDelivery(client)
    const deliveries = {
      [cms.MessageContentType.TEXT]: this._text,
      [cms.MessageContentType.IMAGE]: this._image,
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
}
