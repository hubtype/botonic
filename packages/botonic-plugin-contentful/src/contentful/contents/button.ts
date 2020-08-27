import * as contentful from 'contentful'
import { DeliveryApi } from '../index'
import * as cms from '../../cms'
import { CmsException, ContentType } from '../../cms'
import { CarouselFields } from './carousel'
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  ContentWithNameFields,
} from '../delivery-api'
import { TextFields } from './text'
import { UrlFields } from './url'
import { StartUpFields } from './startup'
import { QueueFields } from './queue'
import { HourRangeFields, ScheduleFields } from './schedule'
import { isOfType } from '../../util/enums'
import { TopContentType } from '../../cms/cms'
import { asyncMap } from '../../util/async'
import { ContentDelivery } from '../content-delivery'

export class ButtonDelivery extends ContentDelivery {
  public static BUTTON_CONTENT_TYPE = 'button'
  private static PAYLOAD_CONTENT_TYPE = 'payload'

  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.BUTTON, delivery, resumeErrors)
  }

  public async button(id: string, context: cms.Context): Promise<cms.Button> {
    const entry = await this.delivery.getEntry<ButtonFields>(id, context)
    return this.fromEntry(entry, context)
  }

  public async fromReferenceSkipErrors(
    entries: contentful.Entry<any>[],
    context: cms.Context
  ): Promise<cms.Button[]> {
    const buttons = await asyncMap(context, entries, async entry => {
      try {
        return await this.fromReference(entry, context)
      } catch (e) {
        // will fail if a draft content is referenced
        this.logOrThrow(`Loading reference to content ${entry.sys.id}`, e)
        return undefined
      }
    })
    return buttons.filter(b => b !== undefined) as cms.Button[]
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
      return this.fromEntry(buttonEntry, context)
    }
    throw new Error(`Unexpected type ${entryType}`)
  }

  public fromEntry(
    buttonEntry: contentful.Entry<ButtonFields>,
    context: cms.Context
  ): cms.Button {
    // target may be empty if we got it from a reference (delivery does not provide infinite recursive references)
    const callback = buttonEntry.fields.target
      ? this.getTargetCallback(buttonEntry.fields.target, context)
      : context.callbacks!.getCallback(buttonEntry.sys.id)
    return new cms.Button(
      buttonEntry.sys.id,
      buttonEntry.fields.name,
      buttonEntry.fields.text ?? '',
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
      return cms.Callback.ofUrl((entry.fields as UrlFields).url || '')
    }
    return new cms.ContentCallback(modelType, entry.sys.id)
  }

  private getTargetCallback(
    target: ButtonTarget,
    context: cms.Context
  ): cms.Callback {
    const model = ContentfulEntryUtils.getContentModel(target) as string
    try {
      switch (model) {
        case ContentType.URL: {
          const urlFields = target as contentful.Entry<UrlFields>
          if (!urlFields.fields.url && context.ignoreFallbackLocale) {
            return cms.Callback.empty()
          }
          return cms.Callback.ofUrl(urlFields.fields.url || '')
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
    } catch (e) {
      throw new CmsException(
        `Error delivering button with id ${target.sys.id}`,
        e
      )
    }
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
  text?: string
  target?: ButtonTarget
}
