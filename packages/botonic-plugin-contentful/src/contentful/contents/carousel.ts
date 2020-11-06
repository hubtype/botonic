import * as contentful from 'contentful'
import { DeliveryWithFollowUp } from './follow-up'
import { ButtonDelivery } from './button'
import * as cms from '../../cms'
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  DeliveryApi,
} from '../delivery-api'

// TODO does not yet load the followU p
export class CarouselDelivery extends DeliveryWithFollowUp {
  constructor(
    delivery: DeliveryApi,
    readonly button: ButtonDelivery,
    resumeErrors: boolean
  ) {
    super(cms.ContentType.CAROUSEL, delivery, resumeErrors)
  }

  async carousel(id: string, context: cms.Context): Promise<cms.Carousel> {
    const entry: contentful.Entry<CarouselFields> = await this.getEntry(
      id,
      context
    )
    return this.fromEntry(entry, context)
  }

  async fromEntry(
    entry: contentful.Entry<CarouselFields>,
    context: cms.Context
  ) {
    const elements = await this.asyncMap(
      context,
      entry.fields.elements,
      async entry => {
        return this.elementFromEntry(entry, context)
      }
    )
    return new cms.Carousel(
      ContentfulEntryUtils.commonFieldsFromEntry(entry),
      elements
    )
  }

  public async element(id: string, context: cms.Context): Promise<cms.Element> {
    const entry = await this.delivery.getEntry<ElementFields>(id, context)
    return this.elementFromEntry(entry, context)
  }

  public async elementFromEntry(
    entry: contentful.Entry<ElementFields>,
    context: cms.Context
  ): Promise<cms.Element> {
    const fields = entry.fields
    const buttonEntries = entry.fields.buttons || []
    const buttons = await this.button.fromReferenceSkipErrors(
      buttonEntries,
      context
    )

    return new cms.Element(
      entry.sys.id,
      buttons,
      fields.title ?? '',
      fields.subtitle ?? '',
      this.urlFromAssetOptional(fields.pic, context)
    )
  }
}

interface ElementFields {
  title?: string
  subtitle?: string
  pic?: contentful.Asset
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buttons?: contentful.Entry<any>[]
}

export interface CarouselFields extends CommonEntryFields {
  elements: contentful.Entry<ElementFields>[]
}
