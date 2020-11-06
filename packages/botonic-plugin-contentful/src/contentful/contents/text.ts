import * as contentful from 'contentful'
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
    private readonly button: ButtonDelivery,
    resumeErrors: boolean
  ) {
    super(cms.ContentType.TEXT, delivery, resumeErrors)
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
    const buttonEntries = fields.buttons || []
    const followup = this.getFollowUp().fromEntry(fields.followup, context)
    const promises: Promise<any>[] = [
      followup,
      this.button.fromReferenceSkipErrors(buttonEntries, context),
    ]
    const followUpAndButtons = await Promise.all(promises)

    const followUp = followUpAndButtons[0] as cms.FollowUp | undefined
    const buttons = followUpAndButtons[1] as cms.Button[]
    const common = ContentfulEntryUtils.commonFieldsFromEntry(entry, followUp)
    return new cms.Text(
      common,
      fields.text ?? '',
      buttons,
      fields.buttonsStyle == 'QuickReplies'
        ? cms.ButtonStyle.QUICK_REPLY
        : cms.ButtonStyle.BUTTON
    )
  }
}

export interface TextFields extends CommonEntryFields {
  // Full text
  text?: string
  // typed as any because we might only get the entry.sys but not the fields
  buttons?: contentful.Entry<any>[]
  buttonsStyle?: string
}
