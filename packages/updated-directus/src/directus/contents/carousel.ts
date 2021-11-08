import { PartialItem } from '@directus/sdk'
import {
  Button,
  Carousel,
  ContentType,
  Element,
  SupportedLocales,
} from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
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
    return this.fromEntry(entry, context)
  }

  fromEntry(entry: PartialItem<any>, context?: SupportedLocales): Carousel {
    const opt = {
      common: {
        id: entry.id,
        name: entry.name ?? '',
        shortText: entry[mf][0]?.shorttext ?? undefined,
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      elements: entry[mf][0]?.elements
        ? this.createElements(entry[mf][0].elements, context)
        : [],
    }
    return new Carousel(opt)
  }

  private createElements(
    elements: PartialItem<any>,
    context?: SupportedLocales
  ): Element[] {
    if (elements.length === 0) {
      return []
    }
    if (context) this.getContextContent(elements[0].item[mf], context)
    return elements.map((item: any) => {
      return this.fromEntryElement(item.item[mf][0], context)
    })
  }

  private fromEntryElement(
    entry: PartialItem<any>,
    context?: SupportedLocales
  ): Element {
    const opt = {
      common: {
        id: entry.element_id,
        name: entry.name ?? '',
      },
      title: entry.title ?? '',
      subtitle: entry.subtitle ?? '',
      imgUrl: entry.image
        ? `${this.client.clientParams.credentials.apiEndPoint}assets/${entry.image}`
        : '',
      buttons: entry.buttons ? this.createButtons(entry.buttons, context) : [],
    }
    return new Element(opt)
  }

  private createButtons(
    buttons: PartialItem<any>,
    context?: SupportedLocales
  ): Button[] {
    if (buttons.length === 0) {
      return []
    }
    return buttons.map((item: any) => {
      return this.button.fromEntry(item.item, item.collection, context)
    })
  }

  private getContextContent(
    entry: PartialItem<any>,
    context: SupportedLocales
  ): void {
    entry.map((content: PartialItem<any>, i: number) => {
      if (content.languages_code != context) {
        entry.splice(i, 1)
      }
    })
  }
}
