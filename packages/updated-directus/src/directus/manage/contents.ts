import { DirectusClient } from '../delivery/directusClient'
import * as cms from '../../cms'
import { Content } from '../../cms'
import { PartialItem } from '@directus/sdk'
import { TextDelivery, TextFields } from '../contents/text'
import { ImageDelivery } from '../contents/image'

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
  ): Object {
    let convertedDirectusText = {}
    if (fields.name) {
      convertedDirectusText = { ...convertedDirectusText, name: fields.name }
    }
    if (fields.shorttext) {
      convertedDirectusText = {
        ...convertedDirectusText,
        shorttext: fields.shorttext,
      }
    }
    if (fields.text) {
      convertedDirectusText = {
        ...convertedDirectusText,
        text: [
          {
            text_id: id,
            languages_code: context,
            text: fields.text,
          },
        ],
      }
    }

    if (fields.buttons) {
      convertedDirectusText = {
        ...convertedDirectusText,
        buttons: this.convertButtons(id, fields.buttons, context),
      }
    }
    return convertedDirectusText
  }

  private convertButtons(
    textId: string,
    buttons: PartialItem<any>,
    context: cms.SupportedLocales
  ): Object[] {
    const convertedButtons = buttons.map((button: any) => {
      let convertedDirectusButton = {}
      let item = {}
      convertedDirectusButton = { ...convertedDirectusButton, text_id: textId }
      if (button.buttonType) {
        convertedDirectusButton = {
          ...convertedDirectusButton,
          collection: button.buttonType,
        }
      }
      if (button.id) {
        item = {
          ...item,
          id: button.id,
        }
      }
      if (button.name) {
        item = {
          ...item,
          name: button.name,
        }
      }
      if (button.text) {
        item = {
          ...item,
          text: [
            {
              text_id: button.id,
              languages_code: context,
              text: button.text,
            },
          ],
        }
      }
      if (button.target) {
        item = {
          ...item,
          target: [
            {
              button_id: button.id,
              collection: button.target.targetType,
              item: {
                id: button.target.id,
                name: button.target.name,
              },
            },
          ],
        }
      }
      convertedDirectusButton = { ...convertedDirectusButton, item }
      return convertedDirectusButton
    })
    return convertedButtons
  }
}
