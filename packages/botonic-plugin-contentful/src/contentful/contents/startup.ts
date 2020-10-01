import * as contentful from 'contentful'
import * as cms from '../../cms'
import { ButtonDelivery } from './button'
import { CommonEntryFields, DeliveryApi } from '../delivery-api'
import { DeliveryWithFollowUp } from './follow-up'

export class StartUpDelivery extends DeliveryWithFollowUp {
  constructor(
    protected delivery: DeliveryApi,
    private readonly button: ButtonDelivery,
    resumeErrors: boolean
  ) {
    super(cms.ContentType.STARTUP, delivery, resumeErrors)
  }

  async startUp(id: string, context: cms.Context): Promise<cms.StartUp> {
    // we only get the 1 level of included references...
    const entry: contentful.Entry<StartUpFields> = await this.getEntry(
      id,
      context
    )
    // .. so we need to fetch the buttons
    return this.fromEntry(entry, context)
  }

  async fromEntry(
    entry: contentful.Entry<StartUpFields>,
    context: cms.Context
  ): Promise<cms.StartUp> {
    const fields = entry.fields
    const buttons = await this.button.fromReferenceSkipErrors(
      fields.buttons || [],
      context
    )
    return new cms.StartUp(
      await this.getFollowUp().commonFields(entry, context),
      this.urlFromAssetOptional(fields.pic),
      fields.text ?? '',
      buttons
    )
  }
}

export interface StartUpFields extends CommonEntryFields {
  pic?: contentful.Asset
  text?: string
  // typed as any because we might only get the entry.sys but not the fields
  buttons?: contentful.Entry<any>[]
}
