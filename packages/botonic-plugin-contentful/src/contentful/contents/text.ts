import * as contentful from 'contentful'

import * as cms from '../../cms'
import { DeliveryApi } from '../delivery-api'
import {
  addCustomFields,
  CommonEntryFields,
  ContentfulEntryUtils,
} from '../delivery-utils'
import { ButtonDelivery } from './button'
import { DeliveryWithReference } from './reference'

export class TextDelivery extends DeliveryWithReference {
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
    const followup = this.getReference().fromEntry(fields.followup, context)
    const promises: Promise<any>[] = [
      followup,
      this.button.fromReferenceSkipErrors(buttonEntries, context),
    ]
    const followUpAndButtons = await Promise.all(promises)

    const followUp = followUpAndButtons[0] as cms.FollowUp | undefined
    const buttons = followUpAndButtons[1] as cms.Button[]
    const common = ContentfulEntryUtils.commonFieldsFromEntry(entry, followUp)
    const buttonsStyle = this.getButtonsStyle(fields.buttonsStyle)
    const referenceDelivery = {
      delivery: this.reference!,
      context,
    }
    return addCustomFields(
      new cms.Text(common, fields.text ?? '', buttons, buttonsStyle),
      fields,
      referenceDelivery
    )
  }

  getButtonsStyle(buttonsStyle?: string): cms.ButtonStyle | undefined {
    if (buttonsStyle == 'QuickReplies') return cms.ButtonStyle.QUICK_REPLY
    if (buttonsStyle == 'Buttons') return cms.ButtonStyle.BUTTON
    return undefined
  }
}

export interface TextFields extends CommonEntryFields {
  // Full text
  text?: string
  // typed as any because we might only get the entry.sys but not the fields
  buttons?: contentful.Entry<any>[]
  buttonsStyle?: string
}
