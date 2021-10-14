import { PartialItem } from '@directus/sdk'

import {
  Button,
  Carousel,
  CommonFields,
  ContentType,
  Element,
  SupportedLocales,
} from '../../cms'
import { getCustomFields } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'
import { ButtonDelivery } from './button'

export class CarouselDelivery extends ContentDelivery {
  private readonly button: ButtonDelivery

  constructor(client: DirectusClient, deliveryButton: ButtonDelivery) {
    super(client, ContentType.CAROUSEL)
    this.button = deliveryButton
  }

  async carousel(id: string, context: SupportedLocales): Promise<Carousel> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry)
  }

  fromEntry(entry: PartialItem<any>): Carousel {
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name as string,
        shortText: entry.shorttext as string,
        keywords: (entry.keywords?.split(',') as string[]) ?? undefined,
        customFields: getCustomFields(entry),
      } as CommonFields,
      elements: this.createElements(entry.elements),
    }
    return new Carousel(opt)
  }

  private createElements(elements: PartialItem<any>): Element[] {
    if (elements.length === 0) {
      return []
    }
    return elements.map((item: any) => {
      return this.fromEntryElement(item.item)
    })
  }

  private fromEntryElement(entry: PartialItem<any>): Element {
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name as string,
      },
      title: entry.title as string,
      subtitle: entry.subtitle as string,
      imgUrl: `${this.client.clientParams.credentials.apiEndPoint}assets/${entry.image}`,
      buttons: this.createButtons(entry.buttons),
    }
    return new Element(opt)
  }

  private createButtons(buttons: PartialItem<any>): Button[] {
    if (buttons.length === 0) {
      return []
    }
    return buttons.map((item: any) => {
      return this.button.fromEntry(item.item, item.collection)
    })
  }
}
