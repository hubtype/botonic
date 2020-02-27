import * as contentful from 'contentful/index'
import { DeliveryWithFollowUp } from './follow-up'
import { ButtonDelivery } from './button'
import * as cms from '../../cms'
import {
  DeliveryApi,
  CommonEntryFields,
  ContentfulEntryUtils,
} from '../delivery-api'

// TODO remove DeliveryWithFollowUp
export class CarouselDelivery extends DeliveryWithFollowUp {
  constructor(delivery: DeliveryApi, readonly button: ButtonDelivery) {
    super(cms.ContentType.CAROUSEL, delivery)
  }

  async carousel(id: string, context: cms.Context): Promise<cms.Carousel> {
    const entry: contentful.Entry<CarouselFields> = await this.delivery.getEntry(
      id,
      context
    )
    return this.fromEntry(entry, context)
  }

  async fromEntry(
    entry: contentful.Entry<CarouselFields>,
    context: cms.Context
  ) {
    const elements = entry.fields.elements.map(async entry => {
      return this.elementFromEntry(entry, context)
    })
    const e = await Promise.all(elements)
    return new cms.Carousel(
      ContentfulEntryUtils.commonFieldsFromEntry(entry),
      e
    )
  }

  private async elementFromEntry(
    entry: contentful.Entry<ElementFields>,
    context: cms.Context
  ): Promise<cms.Element> {
    const fields = entry.fields
    const buttonsPromises = entry.fields.buttons.map(reference =>
      this.button.fromReference(reference, context)
    )

    return Promise.all(buttonsPromises).then(
      buttons =>
        new cms.Element(
          entry.sys.id,
          buttons,
          fields.title,
          fields.subtitle,
          fields.pic && ContentfulEntryUtils.urlFromAsset(fields.pic)
        )
    )
  }
}

interface ElementFields {
  title: string
  subtitle: string
  pic?: contentful.Asset
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buttons: contentful.Entry<any>[]
}

export interface CarouselFields extends CommonEntryFields {
  elements: contentful.Entry<ElementFields>[]
}
