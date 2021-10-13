import { DirectusClient } from '../delivery/directus-client'
import * as cms from '../../cms'
import { AssetInfo, Content } from '../../cms'
import { PartialItem } from '@directus/sdk'
import {
  ButtonFields,
  CarouselFields,
  ElementFields,
  ImageFields,
  TextFields,
} from './directus-contents'
import { Stream } from 'stream'
import { CarouselDelivery } from '../contents/carousel'
import { TextDelivery } from '../contents/text'
import { ImageDelivery } from '../contents/image'
import { UrlDelivery } from '../contents/url'

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

  async deleteContent(
    context: cms.SupportedLocales,
    contentType: cms.ContentType,
    id: string
  ) {
    await this.client.deleteContent(context, contentType, id)
  }

  async createContent(
    context: cms.SupportedLocales,
    contentType: cms.ContentType,
    id: string
  ) {
    await this.client.createContent(context, contentType, id)
  }

  async updateTextFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields
  ): Promise<void> {
    const convertedFields = this.convertTextFields(context, fields)
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
    let convertedEntries: Content[] = []
    entries.forEach((entry: PartialItem<any>) => {
      convertedEntries.push(
        this.ContentDeliveries[contentType].fromEntry(entry, context)
      )
    })
    return convertedEntries
  }

  private convertTextFields(
    context: cms.SupportedLocales,
    fields: TextFields
  ): PartialItem<any> {
    let convertedDirectusText: PartialItem<any> = {}

    if (fields.name) {
      convertedDirectusText = { ...convertedDirectusText, name: fields.name }
    }

    if (fields.text) {
      convertedDirectusText = {
        ...convertedDirectusText,
        text: fields.text,
      }
    }
    if (fields.buttons) {
      convertedDirectusText = {
        ...convertedDirectusText,
        buttons: this.addButtons(fields.buttons),
      }
    }
    if (fields.buttonsStyle) {
      convertedDirectusText = {
        ...convertedDirectusText,
        buttonstyle: fields.buttonsStyle,
      }
    }

    if (fields.followup) {
      convertedDirectusText = {
        ...convertedDirectusText,
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
    return convertedDirectusText
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

    if (fields.name) {
      convertedDirectusButton = {
        ...convertedDirectusButton,
        name: fields.name,
      }
    }

    if (fields.text) {
      convertedDirectusButton = {
        ...convertedDirectusButton,
        text: fields.text,
      }
    }

    if (fields.target) {
      convertedDirectusButton = {
        ...convertedDirectusButton,
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
    return convertedDirectusButton
  }

  private convertImageFields(
    context: cms.SupportedLocales,
    fields: ImageFields
  ): Object {
    let convertedDirectusText: PartialItem<any> = {}

    if (fields.name) {
      convertedDirectusText = { ...convertedDirectusText, name: fields.name }
    }

    if (fields.imgUrl) {
      convertedDirectusText = {
        ...convertedDirectusText,
        image: fields.imgUrl,
      }
    }

    if (fields.followup) {
      convertedDirectusText = {
        ...convertedDirectusText,
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
    return convertedDirectusText
  }

  convertCarouselFields(context: cms.SupportedLocales, fields: CarouselFields) {
    let convertedDirectusCarousel: PartialItem<any> = {}

    if (fields.name) {
      convertedDirectusCarousel = {
        ...convertedDirectusCarousel,
        name: fields.name,
      }
    }
    if (fields.elements) {
      convertedDirectusCarousel = {
        ...convertedDirectusCarousel,
        elements: this.addElements(fields.elements),
      }
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
    if (fields.title) {
      convertedDirectusElement = {
        ...convertedDirectusElement,
        title: fields.title,
      }
    }
    if (fields.subtitle) {
      convertedDirectusElement = {
        ...convertedDirectusElement,
        subtitle: fields.subtitle,
      }
    }
    if (fields.imageId) {
      convertedDirectusElement = {
        ...convertedDirectusElement,
        image: fields.imageId,
      }
    }
    if (fields.buttons) {
      convertedDirectusElement = {
        ...convertedDirectusElement,
        buttons: this.addButtons(fields.buttons),
      }
    }

    return convertedDirectusElement
  }
}
