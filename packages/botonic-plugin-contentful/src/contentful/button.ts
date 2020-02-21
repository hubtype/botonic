import * as contentful from 'contentful'
import { DeliveryApi } from '.'
import { ContentType } from '../cms'
import * as cms from '../cms'
import { CarouselFields } from './carousel'
import { CommonEntryFields, ContentWithNameFields } from './delivery-api'
import { TextFields } from './text'
import { UrlFields } from './url'

export class ButtonDelivery {
  private static BUTTON_CONTENT_TYPE = 'button'
  private static PAYLOAD_CONTENT_TYPE = 'payload'
  constructor(private readonly delivery: DeliveryApi) {}

  public fromReference(
    reference: contentful.Entry<any>,
    context: cms.Context
  ): Promise<cms.Button> {
    return this.fromId(reference.sys.id, context)
  }

  private async fromId(id: string, context: cms.Context): Promise<cms.Button> {
    const entry = await this.delivery.getEntry(id, context)
    const entryType = DeliveryApi.getContentModel(entry)
    switch (entryType as string) {
      case cms.ContentType.CAROUSEL:
      case cms.ContentType.TEXT:
      case cms.ContentType.URL:
        return ButtonDelivery.fromContentReference(
          entry as contentful.Entry<CommonEntryFields>
        )
      case ButtonDelivery.BUTTON_CONTENT_TYPE: {
        const buttonEntry = entry as contentful.Entry<ButtonFields>
        return await this.fromEntry(buttonEntry, context)
      }
      default:
        throw new Error(`Unexpected type ${entryType}`)
    }
  }

  public async fromEntry(
    buttonEntry: contentful.Entry<ButtonFields>,
    context: cms.Context
  ) {
    // target may be empty if we got it from a reference (delivery does not provide infinite recursive references)
    const callback = buttonEntry.fields.target
      ? await this.getTargetCallback(buttonEntry.fields.target)
      : context.callbacks!.getCallback(buttonEntry.sys.id)
    return new cms.Button(
      buttonEntry.sys.id,
      buttonEntry.fields.name,
      buttonEntry.fields.text,
      callback
    )
  }

  // TODO move to a new CmsUtils.buttonToCallback(cms.ContentCallback)?
  private static fromContentReference(
    entry: contentful.Entry<CommonEntryFields>
  ): cms.Button {
    const fields = entry.fields
    let text = fields.shortText
    if (!text) {
      text = fields.name
      console.error(`Text ${text} without short text`)
    }
    return new cms.Button(
      entry.sys.id,
      fields.name,
      text,
      DeliveryApi.callbackFromEntry(entry)
    )
  }

  private getTargetCallback(target: ButtonTarget): cms.Callback {
    const model = DeliveryApi.getContentModel(target) as string
    switch (model) {
      case ContentType.STARTUP:
      case ContentType.CAROUSEL:
      case ContentType.TEXT:
        return new cms.ContentCallback(model, target.sys.id)
      case ContentType.URL: {
        const urlFields = target as contentful.Entry<UrlFields>
        return cms.Callback.ofUrl(urlFields.fields.url)
      }
      case ButtonDelivery.PAYLOAD_CONTENT_TYPE: {
        const payloadFields = target as contentful.Entry<PayloadFields>
        return cms.Callback.ofPayload(payloadFields.fields.payload)
      }
      default:
        throw new Error('Unexpected type: ' + model)
    }
  }
}

export interface PayloadFields {
  payload: string
}

type ButtonTarget = contentful.Entry<
  CarouselFields | TextFields | UrlFields | PayloadFields
>

export interface ButtonFields extends ContentWithNameFields {
  text: string
  target?: ButtonTarget
}
