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
    return {
      name: fields.name,
      shorttext: fields.shorttext,
      text: [
        {
          text_id: id,
          languages_code: context,
          text: fields.buttons![0].text,
        },
      ],
    }
  }
}
