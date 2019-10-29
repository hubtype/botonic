import * as contentful from 'contentful'
import { DeliveryWithFollowUp } from './follow-up'
import { ButtonDelivery } from './button'
import * as cms from '../cms'
import {
  DeliveryApi,
  CommonEntryFields,
  commonFieldsFromEntry
} from './delivery-api'

// TODO remove DeliveryWithFollowUp
export class CarouselDelivery extends DeliveryWithFollowUp {
  constructor(delivery: DeliveryApi, readonly button: ButtonDelivery) {
    super(cms.ModelType.CAROUSEL, delivery)
  }

  async carousel(id: string, context: cms.Context): Promise<cms.Carousel> {
    const entry: contentful.Entry<
      CarouselFields
    > = await this.delivery.getEntry(id, context)
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
    return new cms.Carousel(commonFieldsFromEntry(entry), e)
  }

  /**
   * @todo support multiple buttons
   */
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
          buttons,
          fields.title,
          fields.subtitle,
          fields.pic && DeliveryApi.urlFromAsset(fields.pic)
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
