import { DirectusClient } from '../delivery/directus-client'
import * as cms from '../../cms'
import { Content } from '../../cms'
import { PartialItem } from '@directus/sdk'
import { TextDelivery } from '../contents/text'
import { ImageDelivery } from '../contents/image'
import { ButtonFields, ImageFields, TextFields } from './directus-contents'

export interface ContentDeliveries {
  [cms.MessageContentType.TEXT]: TextDelivery
  [cms.MessageContentType.IMAGE]: ImageDelivery
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
    const convertedFields = this.convertTextFields(id, context, fields)
    await this.client.updateTextFields(context, id, convertedFields)
  }

  async updateButtonFields(
    context: cms.SupportedLocales,
    id: string,
    fields: ButtonFields
  ): Promise<void> {
    const convertedFields = this.convertButtonFields(id, context, fields)
    await this.client.updateButtonFields(context, id, convertedFields)
  }

  async updateImageFields(
    context: cms.SupportedLocales,
    id: string,
    fields: ImageFields
  ): Promise<void> {
    const convertedFields = this.convertImageFields(id, context, fields)
    await this.client.updateImageFields(context, id, convertedFields)
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
    id: string,
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
        buttons: this.addButtons(id, fields.buttons),
      }
    }

    if (fields.followup) {
      convertedDirectusText = {
        ...convertedDirectusText,
        followup: [
          {
            collection: fields.followup.type,
            text_id: id,
            item: {
              id: fields.followup.id,
            },
          },
        ],
      }
    }
    return convertedDirectusText
  }

  private addButtons(textId: string, buttonsIds: string[]): PartialItem<any>[] {
    const textButtons = buttonsIds.map((buttonId: string) => {
      return {
        collection: 'button',
        text_id: textId,
        item: {
          id: buttonId,
        },
      }
    })
    return textButtons
  }

  private convertButtonFields(
    id: string,
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
            collection: fields.target.type,
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
    id: string,
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
            collection: fields.followup.type,
            item: {
              id: fields.followup.id,
            },
          },
        ],
      }
    }
    return convertedDirectusText
  }
}
