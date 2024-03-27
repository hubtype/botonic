import * as contentful from 'contentful'

import * as cms from '../../cms'
import { Button, CmsException, ContentType } from '../../cms'
import { TopContentType } from '../../cms/cms'
import { CONTENT_FIELDS, ContentField } from '../../manage-cms/fields'
import { isOfType } from '../../util/enums'
import { ContentDelivery } from '../content-delivery'
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  ContentWithNameFields,
} from '../delivery-utils'
import { DeliveryApi } from '../index'
import { CallbackTarget, getTargetCallback } from './callback-delivery'
import { UrlFields } from './url'

export class ButtonDelivery extends ContentDelivery {
  public static BUTTON_CONTENT_TYPE = 'button'

  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.BUTTON, delivery, resumeErrors)
  }

  public async button(id: string, context: cms.Context): Promise<cms.Button> {
    const entry = await this.getEntry<ButtonFields>(id, context)
    return this.fromEntry(entry, context)
  }

  public async fromReferenceSkipErrors(
    entries: contentful.Entry<any>[],
    context: cms.Context
  ): Promise<cms.Button[]> {
    return await this.asyncMap(context, entries, entry =>
      this.fromReference(entry, context)
    )
  }

  private async fromReference(
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
      return this.fromContentReference(
        entry as contentful.Entry<CommonEntryFields>,
        context
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
    if (!buttonEntry.fields.target) {
      throw new CmsException(
        `Button ${this.entryId(buttonEntry)} has no target`
      )
    }
    // target may be empty if we got it from a reference (delivery does not provide infinite recursive references)
    const callback = getTargetCallback(buttonEntry.fields.target, context)
    const newButton = new cms.Button(
      buttonEntry.sys.id,
      buttonEntry.fields.name,
      buttonEntry.fields.text ?? '',
      callback
    )
    return this.addCustomFields(newButton, buttonEntry.fields)
  }

  // TODO move to a new CmsUtils.buttonToCallback(cms.ContentCallback)?
  private fromContentReference(
    entry: contentful.Entry<CommonEntryFields>,
    _context: cms.Context
  ): cms.Button {
    const fields = entry.fields
    const text = fields.shortText || ''
    const newButton = new Button(
      entry.sys.id,
      fields.name,
      text,
      ButtonDelivery.callbackFromEntry(entry)
    )
    return this.addCustomFields(newButton, fields, true)
  }

  private addCustomFields(
    button: Button,
    entryFields: CommonEntryFields,
    buttonIsMessageContent = false
  ): Button {
    const buttonAttributes = Object.keys(button)

    const knownFields: string[] = ['target']

    //if the button is created from a content (text, image, etc) we have to avoid adding all their fields as custom fields
    if (buttonIsMessageContent) {
      CONTENT_FIELDS.forEach((field: ContentField) => {
        knownFields.push(field.cmsName)
      })
    }

    const customKeys = Object.keys(entryFields).filter(
      (field: string) =>
        !buttonAttributes.includes(field) && !knownFields.includes(field)
    )
    button.customFields = {}
    for (const customKey of customKeys) {
      button.customFields[customKey] = (entryFields as any)[customKey]
    }
    return button
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
}

export interface ButtonFields extends ContentWithNameFields {
  text?: string
  target?: CallbackTarget
}
