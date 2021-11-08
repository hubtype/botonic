import { PartialItem } from '@directus/sdk'
import { mf } from '../delivery/delivery-utils'
import { Stream } from 'stream'

import * as cms from '../../cms'
import { AssetInfo, Content, ContentId } from '../../cms'
import { CarouselDelivery } from '../contents/carousel'
import { ImageDelivery } from '../contents/image'
import { TextDelivery } from '../contents/text'
import { UrlDelivery } from '../contents/url'
import { DirectusClient } from '../delivery/directus-client'
import {
  ButtonFields,
  CarouselFields,
  ElementFields,
  ImageFields,
  TextFields,
} from './directus-contents'

export interface ContentDeliveries {
  [cms.ContentType.TEXT]: TextDelivery
  [cms.ContentType.IMAGE]: ImageDelivery
  [cms.ContentType.CAROUSEL]: CarouselDelivery
  [cms.ContentType.URL]: UrlDelivery
}

export class ContentsDelivery {
  readonly client: DirectusClient
  readonly ContentDeliveries: ContentDeliveries
  constructor(client: DirectusClient, ContentDeliveries: ContentDeliveries) {
    this.client = client
    this.ContentDeliveries = ContentDeliveries
  }

  async topContents(
    contentType: cms.MessageContentType,
    context: cms.SupportedLocales
  ): Promise<Content[]> {
    const entries = await this.client.topContents(contentType, context)
    return this.fromEntry(entries, contentType, context)
  }

  async deleteContent(contentId: ContentId) {
    await this.client.deleteContent(contentId)
  }

  async createContent(contentId: ContentId) {
    await this.client.createContent(contentId)
  }

  async updateTextFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields
  ): Promise<void> {
    const convertedFields = await this.convertTextFields(context, fields, id)
    await this.client.updateFields(
      context,
      cms.ContentType.TEXT,
      id,
      convertedFields
    )
  }

  async updateButtonFields(
    context: cms.SupportedLocales,
    id: string,
    fields: ButtonFields
  ): Promise<void> {
    const convertedFields = await this.convertButtonFields(context, fields, id)
    await this.client.updateFields(
      context,
      cms.ContentType.BUTTON,
      id,
      convertedFields
    )
  }

  async updateImageFields(
    context: cms.SupportedLocales,
    id: string,
    fields: ImageFields
  ): Promise<void> {
    const convertedFields = await this.convertImageFields(context, fields, id)
    await this.client.updateFields(
      context,
      cms.ContentType.IMAGE,
      id,
      convertedFields
    )
  }

  async updateCarouselFields(
    context: cms.SupportedLocales,
    id: string,
    fields: CarouselFields
  ): Promise<void> {
    const convertedFields = await this.convertCarouselFields(
      context,
      fields,
      id
    )
    await this.client.updateFields(
      context,
      cms.ContentType.CAROUSEL,
      id,
      convertedFields
    )
  }

  async updateElementFields(
    context: cms.SupportedLocales,
    id: string,
    fields: ElementFields
  ): Promise<void> {
    const convertedFields = await this.convertElementFields(context, fields, id)
    await this.client.updateFields(
      context,
      cms.ContentType.ELEMENT,
      id,
      convertedFields
    )
  }

  async createAsset(
    context: cms.SupportedLocales,
    file: string | ArrayBuffer | Stream,
    info: AssetInfo
  ): Promise<void> {
    await this.client.createAsset(context, file, info)
  }

  fromEntry(
    entries: PartialItem<any>[],
    contentType: cms.MessageContentType,
    context: cms.SupportedLocales
  ): Content[] {
    const convertedEntries: Content[] = []
    entries.forEach((entry: PartialItem<any>) => {
      convertedEntries.push(
        this.ContentDeliveries[contentType].fromEntry(entry, context)
      )
    })
    return convertedEntries
  }

  private async convertTextFields(
    context: cms.SupportedLocales,
    fields: TextFields,
    id: string
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.TEXT)
    let localeContent = this.getLocaleContent(entry, context)

    if (localeContent === undefined) {
      localeContent = {
        languages_code: context,
      }
      entry.multilanguage_fields.push(localeContent)
    }

    if (fields.name) {
      entry.name = fields.name
    }

    if (fields.text) {
      localeContent.text = fields.text
    }

    if (fields.buttons) {
      localeContent.buttons = this.addButtons(fields.buttons)
    }

    if (fields.buttonsStyle) {
      localeContent.buttonsStyle = fields.buttonsStyle
    }

    if (fields.followup) {
      localeContent.followup = [
        {
          collection: fields.followup.model,
          item: {
            id: fields.followup.id,
          },
        },
      ]
    }

    return entry
  }

  private addButtons(buttonsIds: string[]): PartialItem<any>[] {
    const buttons = buttonsIds.map((buttonId: string) => {
      return {
        collection: 'button',
        item: {
          id: buttonId,
        },
      }
    })
    return buttons
  }

  private async convertButtonFields(
    context: cms.SupportedLocales,
    fields: ButtonFields,
    id: string
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.BUTTON)
    let localeContent = this.getLocaleContent(entry, context)

    if (localeContent === undefined) {
      localeContent = {
        languages_code: context,
      }
      entry.multilanguage_fields.push(localeContent)
    }

    if (fields.name) {
      entry.name = fields.name
    }

    if (fields.text) {
      localeContent.text = fields.text
    }

    if (fields.target) {
      localeContent.target = [
        {
          collection: fields.target.model,
          item: {
            id: fields.target.id,
          },
        },
      ]
    }

    return entry
  }

  private async convertImageFields(
    context: cms.SupportedLocales,
    fields: ImageFields,
    id: string
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.IMAGE)
    let localeContent = this.getLocaleContent(entry, context)

    if (localeContent === undefined) {
      localeContent = {
        languages_code: context,
      }
      entry.multilanguage_fields.push(localeContent)
    }

    if (fields.name) {
      entry.name = fields.name
    }

    if (fields.imgUrl) {
      localeContent.imgUrl = fields.imgUrl
    }

    if (fields.followup) {
      localeContent.followup = [
        {
          collection: fields.followup.model,
          item: {
            id: fields.followup.id,
          },
        },
      ]
    }

    return entry
  }

  private async convertCarouselFields(
    context: cms.SupportedLocales,
    fields: CarouselFields,
    id: string
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.CAROUSEL)

    let localeContent = this.getLocaleContent(entry, context)

    if (localeContent === undefined) {
      localeContent = {
        languages_code: context,
      }
      entry.multilanguage_fields.push(localeContent)
    }

    if (fields.name) {
      entry.name = fields.name
    }

    if (fields.elements) {
      localeContent.elements = this.addElements(fields.elements)
    }

    return entry
  }

  private addElements(elementdIds: string[]): PartialItem<any>[] {
    const carouselElements = elementdIds.map((elementId: string) => {
      return {
        collection: 'element',
        item: {
          id: elementId,
        },
      }
    })
    return carouselElements
  }

  private async convertElementFields(
    context: cms.SupportedLocales,
    fields: ElementFields,
    id: string
  ) {
    const entry = await this.client.getEntry(id, cms.ContentType.ELEMENT)
    let localeContent = this.getLocaleContent(entry, context)

    if (localeContent === undefined) {
      localeContent = {
        languages_code: context,
      }
      entry.multilanguage_fields.push(localeContent)
    }

    if (fields.name) {
      entry.name = fields.name
    }

    if (fields.title) {
      localeContent.title = fields.title
    }

    if (fields.subtitle) {
      localeContent.subtitle = fields.subtitle
    }

    if (fields.image) {
      localeContent.image = fields.image
    }

    if (fields.buttons) {
      localeContent.buttons = this.addButtons(fields.buttons)
    }

    return entry
  }

  private getLocaleContent(
    entry: PartialItem<any>,
    context: cms.SupportedLocales
  ): PartialItem<any> {
    const localeFound = entry[mf].find(
      (localeContent: PartialItem<any>) =>
        localeContent.languages_code === context
    )
    return localeFound
  }
}
