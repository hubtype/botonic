import * as contentful from 'contentful/index'
import * as cms from '../../cms'
import { ButtonDelivery } from './button'
import {
  DeliveryApi,
  CommonEntryFields,
  ContentfulEntryUtils,
} from '../delivery-api'
import { DeliveryWithFollowUp } from './follow-up'

export class TextDelivery extends DeliveryWithFollowUp {
  constructor(
    protected delivery: DeliveryApi,
    private readonly button: ButtonDelivery
  ) {
    super(cms.ContentType.TEXT, delivery)
  }

  async text(id: string, context: cms.Context): Promise<cms.Text> {
    // we only get the 1 level of included references...
    const entry: contentful.Entry<TextFields> = await this.getEntry(id, context)
    // .. so we need to fetch the buttons
    return this.fromEntry(entry, context)
  }

  async fromEntry(
    entry: contentful.Entry<TextFields>,
    context: cms.Context
  ): Promise<cms.Text> {
    const fields = entry.fields
    const buttons = fields.buttons || []
    const followup: Promise<
      cms.Content | undefined
    > = this.getFollowUp().fromEntry(fields.followup, context)
    const promises = [followup]
    promises.push(
      ...buttons.map(reference => this.button.fromReference(reference, context))
    )

    return Promise.all(promises).then(followUpAndButtons => {
      const followUp = followUpAndButtons.shift() as cms.FollowUp | undefined
      const buttons = followUpAndButtons as cms.Button[]
      const common = ContentfulEntryUtils.commonFieldsFromEntry(entry, followUp)
      return new cms.Text(
        common,
        fields.text ?? '',
        buttons,
        fields.buttonsStyle == 'QuickReplies'
          ? cms.ButtonStyle.QUICK_REPLY
          : cms.ButtonStyle.BUTTON
      )
    })
  }
}

export interface TextFields extends CommonEntryFields {
  // Full text
  text?: string
  // typed as any because we might only get the entry.sys but not the fields
  buttons?: contentful.Entry<any>[]
  buttonsStyle?: string
}
