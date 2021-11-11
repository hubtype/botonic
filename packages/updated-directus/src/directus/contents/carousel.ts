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
    return elements.map((element: any) => {
      return this.fromEntryElement(element.item, context)
    })
  }

  private fromEntryElement(
    entry: PartialItem<any>,
    context?: SupportedLocales
  ): Element {
    if (context) entry[mf] = this.getContextContent(entry[mf], context)
    const opt = {
      common: {
        id: entry.id,
        name: entry.name ?? '',
      },
      title: entry[mf][0].title ?? '',
      subtitle: entry[mf][0].subtitle ?? '',
      imgUrl: entry[mf][0].image
        ? `${this.client.clientParams.credentials.apiEndPoint}assets/${entry[mf][0].image}`
        : '',
      buttons: entry[mf][0].buttons
        ? this.createButtons(entry[mf][0].buttons, context)
        : [],
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
  ): PartialItem<any> {
    const localeContent = entry.find(
      (content: PartialItem<any>) => content.languages_code === context
    )
    return [localeContent]
  }
}
