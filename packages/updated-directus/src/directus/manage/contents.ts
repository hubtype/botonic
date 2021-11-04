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
    const convertedFields = this.convertButtonFields(context, fields)
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
    const convertedFields = this.convertImageFields(context, fields)
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
    const convertedFields = this.convertCarouselFields(context, fields)
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
    const convertedFields = this.convertElementFields(context, fields)
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

    console.log({ localeContent })
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

  private convertButtonFields(
    context: cms.SupportedLocales,
    fields: ButtonFields
  ): PartialItem<any> {
    let convertedDirectusButton: PartialItem<any> = {}
    let multilanguage_fields: PartialItem<any> = {}

    if (fields.name) {
      convertedDirectusButton = {
        ...convertedDirectusButton,
        name: fields.name,
      }
    }

    multilanguage_fields = {
      ...multilanguage_fields,
      languages_code: context,
    }

    if (fields.text) {
      multilanguage_fields = {
        ...multilanguage_fields,
        text: fields.text,
      }
    }

    if (fields.target) {
      multilanguage_fields = {
        ...multilanguage_fields,
        target: [
          {
            collection: fields.target.model,
            item: {
              id: fields.target.id,
            },
          },
        ],
      }
    }

    convertedDirectusButton = {
      ...convertedDirectusButton,
      multilanguage_fields,
    }

    return convertedDirectusButton
  }

  private convertImageFields(
    context: cms.SupportedLocales,
    fields: ImageFields
  ): Object {
    let convertedDirectusImage: PartialItem<any> = {}
    let multilanguage_fields: PartialItem<any> = {}

    if (fields.name) {
      convertedDirectusImage = { ...convertedDirectusImage, name: fields.name }
    }

    multilanguage_fields = {
      ...multilanguage_fields,
      languages_code: context,
    }

    if (fields.imgUrl) {
      multilanguage_fields = {
        ...multilanguage_fields,
        image: fields.imgUrl,
      }
    }

    if (fields.followup) {
      multilanguage_fields = {
        ...multilanguage_fields,
        followup: [
          {
            collection: fields.followup.model,
            item: {
              id: fields.followup.id,
            },
          },
        ],
      }
    }

    convertedDirectusImage = {
      ...convertedDirectusImage,
      multilanguage_fields,
    }

    return convertedDirectusImage
  }

  private convertCarouselFields(
    context: cms.SupportedLocales,
    fields: CarouselFields
  ) {
    let convertedDirectusCarousel: PartialItem<any> = {}
    let multilanguage_fields: PartialItem<any> = {}

    if (fields.name) {
      convertedDirectusCarousel = {
        ...convertedDirectusCarousel,
        name: fields.name,
      }
    }

    multilanguage_fields = {
      ...multilanguage_fields,
      languages_code: context,
    }

    if (fields.elements) {
      multilanguage_fields = {
        ...multilanguage_fields,
        elements: this.addElements(fields.elements),
      }
    }

    convertedDirectusCarousel = {
      ...convertedDirectusCarousel,
      multilanguage_fields,
    }
    return convertedDirectusCarousel
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

  convertElementFields(context: cms.SupportedLocales, fields: ElementFields) {
    let convertedDirectusElement: PartialItem<any> = {}
    let multilanguage_fields: PartialItem<any> = {}

    if (fields.name) {
      convertedDirectusElement = {
        ...convertedDirectusElement,
        name: fields.name,
      }
    }

    multilanguage_fields = {
      ...multilanguage_fields,
      languages_code: context,
    }

    if (fields.title) {
      multilanguage_fields = {
        ...multilanguage_fields,
        title: fields.title,
      }
    }
    if (fields.subtitle) {
      multilanguage_fields = {
        ...multilanguage_fields,
        subtitle: fields.subtitle,
      }
    }
    if (fields.image) {
      multilanguage_fields = {
        ...multilanguage_fields,
        image: fields.image,
      }
    }
    if (fields.buttons) {
      multilanguage_fields = {
        ...multilanguage_fields,
        buttons: this.addButtons(fields.buttons),
      }
    }

    convertedDirectusElement = {
      ...convertedDirectusElement,
      multilanguage_fields,
    }

    return convertedDirectusElement
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
