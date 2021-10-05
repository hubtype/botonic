import { ContentDelivery } from '../delivery'
import { DirectusClient } from '../delivery'
import * as cms from '../../cms'
import { CommonFields, Text, Image } from '../../cms'
import { PartialItem } from '@directus/sdk'
import { ButtonDelivery } from './button'
import { ImageDelivery } from './image'
import { getCustomFields } from '../../directus/delivery/delivery-utils'

export class TextDelivery extends ContentDelivery {
  private readonly button: ButtonDelivery
  private readonly image: ImageDelivery
  constructor(
    client: DirectusClient,
    deliveryButton: ButtonDelivery,
    deliveryImage: ImageDelivery
  ) {
    super(client, cms.MessageContentType.TEXT)
    this.button = deliveryButton
    this.image = deliveryImage
  }

  async text(id: string, context: cms.SupportedLocales): Promise<Text> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry, context)
  }

  fromEntry(entry: PartialItem<any>, context: cms.SupportedLocales): Text {
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name as string,
        followup: this.createFollowup(entry.followup, context),
        keywords: (entry?.keywords?.split(',') as string[]) ?? undefined,
        customFields: getCustomFields(entry),
      } as CommonFields,
      text: (entry?.text as string) ?? undefined,
      buttons: this.createButtons(entry.buttons, context),
    }
    return new Text(opt)
  }

  private createButtons(
    buttons: PartialItem<any>,
    context: cms.SupportedLocales
  ): cms.Button[] {
    if (buttons.length === 0) {
      return []
    }
    return buttons.map((item: any) => {
      return this.button.fromEntry(item.item, item.collection)
    })
  }

  private createFollowup(
    followup: PartialItem<any>,
    context: cms.SupportedLocales
  ): Text | Image | undefined {
    if (followup.length === 0) {
      return undefined
    }
    const contentType = followup.hasOwnProperty('image')
      ? cms.MessageContentType.IMAGE
      : cms.MessageContentType.TEXT
    return contentType === cms.MessageContentType.IMAGE
      ? this.image.fromEntry(followup, context)
      : this.fromEntry(followup, context)
  }
}
