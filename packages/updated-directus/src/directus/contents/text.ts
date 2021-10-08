import { ContentDelivery } from '../delivery'
import { DirectusClient } from '../delivery'
import * as cms from '../../cms'
import { CommonFields, Text, Image, Carousel } from '../../cms'
import { PartialItem } from '@directus/sdk'
import { ButtonDelivery } from './button'
import { ImageDelivery } from './image'
import { getCustomFields } from '../../directus/delivery/delivery-utils'
import { CarouselDelivery } from './carousel'

export class TextDelivery extends ContentDelivery {
  private readonly button: ButtonDelivery
  private readonly image: ImageDelivery
  private readonly carousel: CarouselDelivery
  constructor(
    client: DirectusClient,
    deliveryButton: ButtonDelivery,
    deliveryImage: ImageDelivery,
    deliveryCarousel: CarouselDelivery
  ) {
    super(client, cms.ContentType.TEXT)
    this.button = deliveryButton
    this.image = deliveryImage
    this.carousel = deliveryCarousel
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
        followUp: this.createFollowup(entry.followup, context),
        keywords: (entry?.keywords?.split(',') as string[]) ?? undefined,
        customFields: getCustomFields(entry),
      } as CommonFields,
      text: (entry?.text as string) ?? undefined,
      buttons: this.createButtons(entry.buttons, context),
      buttonsStyle: this.getButtonsStyle(entry.buttonstyle),
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
  ): Text | Image | Carousel | undefined {
    if (followup.length === 0) {
      return undefined
    }
    const contentType = followup.hasOwnProperty('image')
      ? cms.ContentType.IMAGE
      : followup.hasOwnProperty('elements')
      ? cms.ContentType.CAROUSEL
      : cms.ContentType.TEXT

    return contentType === cms.ContentType.IMAGE
      ? this.image.fromEntry(followup, context)
      : contentType === cms.ContentType.CAROUSEL
      ? this.carousel.fromEntry(followup)
      : this.fromEntry(followup, context)
  }

  private getButtonsStyle(buttonsStyle: string): cms.ButtonStyle | undefined {
    if (buttonsStyle === 'QuickReplies') return cms.ButtonStyle.QUICK_REPLY
    else if (buttonsStyle === 'Buttons') return cms.ButtonStyle.BUTTON
    else return cms.ButtonStyle.BUTTON
  }
}
