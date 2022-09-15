import * as contentful from 'contentful'

import * as cms from '../../cms'
import { DeliveryApi } from '../delivery-api'
import {
  addCustomFields,
  CommonEntryFields,
  ContentfulEntryUtils,
} from '../delivery-utils'
import { ButtonDelivery } from './button'
import { DeliveryWithFollowUp } from './follow-up'

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
    const fields = entry.fields
    const followup = await this.getFollowUp().fromEntry(
      fields.followup,
      context
    )
    const common = ContentfulEntryUtils.commonFieldsFromEntry(entry, followup)
    return addCustomFields(new cms.Carousel(common, elements), entry.fields)
  }

  public async element(id: string, context: cms.Context): Promise<cms.Element> {
    const entry = await this.delivery.getEntry<ElementFields>(id, context)
    return this.elementFromEntry(entry, context)
  }

  public async elementFromEntry(
    entry: contentful.Entry<ElementFields>,
    context: cms.Context
  ): Promise<cms.Element> {
    this.checkEntry(entry)
    const fields = entry.fields
    const buttonEntries = fields.buttons || []
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
