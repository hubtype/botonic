import { PartialItem } from '@directus/sdk'

import * as cms from '../../cms'
import { Carousel, Image, Text } from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'
import { ButtonDelivery } from './button'
import { CarouselDelivery } from './carousel'
import { ImageDelivery } from './image'

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
        id: entry.id,
        name: entry.name ?? '',
        shortText: entry[mf][0]?.shorttext ?? undefined,
        followUp: entry[mf][0]
          ? this.createFollowup(entry[mf][0], context)
          : undefined,
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      text: entry[mf][0]?.text ?? '',
      buttons: entry[mf][0]
        ? this.createButtons(entry[mf][0]?.buttons, context)
        : [],
      buttonsStyle: entry[mf][0]
        ? this.getButtonsStyle(entry[mf][0]?.buttonstyle)
        : undefined,
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
      return this.button.fromEntry(item.item, item.collection, context)
    })
  }

  private createFollowup(
    entry: PartialItem<any>,
    context: cms.SupportedLocales
  ): Text | Image | Carousel | undefined {
    console.log({ entry })
    if (!entry.followup || !entry.followup.length) {
      return undefined
    }

    let contentType
    if (entry.followup[mf][0].hasOwnProperty('image')) {
      contentType = cms.ContentType.IMAGE
    } else if (entry.followup[mf][0].hasOwnProperty('elements')) {
      contentType = cms.ContentType.CAROUSEL
    } else contentType = cms.ContentType.TEXT

    return contentType === cms.ContentType.IMAGE
      ? this.image.fromEntry(entry.followup, context)
      : contentType === cms.ContentType.CAROUSEL
      ? this.carousel.fromEntry(entry.followup, context)
      : this.fromEntry(entry.followup, context)
  }

  private getButtonsStyle(buttonsStyle: string): cms.ButtonStyle | undefined {
    if (buttonsStyle === 'QuickReplies') return cms.ButtonStyle.QUICK_REPLY
    else if (buttonsStyle === 'Buttons') return cms.ButtonStyle.BUTTON
    else return cms.ButtonStyle.BUTTON
  }
}
