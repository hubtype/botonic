import * as contentful from 'contentful/index'
import { DeliveryApi } from '../index'
import { ContentType, CmsException } from '../../cms'
import * as cms from '../../cms'
import { CarouselFields } from './carousel'
import {
  ContentfulEntryUtils,
  CommonEntryFields,
  ContentWithNameFields,
} from '../delivery-api'
import { TextFields } from './text'
import { UrlFields } from './url'
import { StartUpFields } from './startup'
import { QueueFields } from './queue'
import { HourRangeFields, ScheduleFields } from './schedule'
import { isOfType } from '../../util/enums'
import { TopContentType } from '../../cms/cms'

export class ButtonDelivery {
  public static BUTTON_CONTENT_TYPE = 'button'
  private static PAYLOAD_CONTENT_TYPE = 'payload'
  constructor(private readonly delivery: DeliveryApi) {}

  public async button(id: string, context: cms.Context): Promise<cms.Button> {
    const entry = await this.delivery.getEntry<ButtonFields>(id, context)
    return this.fromEntry(entry, context)
  }

  public async fromReference(
    entry: contentful.Entry<any>,
    context: cms.Context
  ): Promise<cms.Button> {
    // we could pass the entry to fromId to avoid fetching it again, but it makes
    // the code more complex when the reference is a button
    try {
      return await this.fromId(entry.sys.id, context)
    } catch (e) {
      throw new CmsException(
        `Error loading button with id '${entry.sys.id}'`,
        e
      )
    }
  }

  private async fromId(id: string, context: cms.Context): Promise<cms.Button> {
    const entry = await this.delivery.getEntry(id, context)
    const entryType = ContentfulEntryUtils.getContentModel(entry)
    if (isOfType(entryType, TopContentType)) {
      return ButtonDelivery.fromContentReference(
        entry as contentful.Entry<CommonEntryFields>
      )
    }
    if (entryType === ButtonDelivery.BUTTON_CONTENT_TYPE) {
      const buttonEntry = entry as contentful.Entry<ButtonFields>
      return await this.fromEntry(buttonEntry, context)
    }
    throw new Error(`Unexpected type ${entryType}`)
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
      ButtonDelivery.callbackFromEntry(entry)
    )
  }

  private static callbackFromEntry(entry: contentful.Entry<any>): cms.Callback {
    const modelType = ContentfulEntryUtils.getContentModel(
      entry
    ) as cms.TopContentType
    if (modelType === ContentType.URL) {
      return cms.Callback.ofUrl((entry.fields as UrlFields).url)
    }
    return new cms.ContentCallback(modelType, entry.sys.id)
  }

  private getTargetCallback(target: ButtonTarget): cms.Callback {
    const model = ContentfulEntryUtils.getContentModel(target) as string
    switch (model) {
      case ContentType.URL: {
        const urlFields = target as contentful.Entry<UrlFields>
        return cms.Callback.ofUrl(urlFields.fields.url)
      }
      case ButtonDelivery.PAYLOAD_CONTENT_TYPE: {
        const payloadFields = target as contentful.Entry<PayloadFields>
        return cms.Callback.ofPayload(payloadFields.fields.payload)
      }
    }
    if (isOfType(model, TopContentType)) {
      return new cms.ContentCallback(model, target.sys.id)
    }
    throw new Error('Unexpected type: ' + model)
  }
}

export interface PayloadFields {
  payload: string
}

type ButtonTarget = contentful.Entry<
  | CarouselFields
  | TextFields
  | UrlFields
  | PayloadFields
  | StartUpFields
  | QueueFields
  | HourRangeFields
  | ScheduleFields
>

export interface ButtonFields extends ContentWithNameFields {
  text: string
  target?: ButtonTarget
}
