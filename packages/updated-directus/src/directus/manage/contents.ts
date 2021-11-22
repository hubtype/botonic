import { PartialItem } from '@directus/sdk'
import { mf } from '../delivery/delivery-utils'
import { Stream } from 'stream'

import * as cms from '../../cms'
import { AssetInfo, Content, ContentId } from '../../cms'
import { CarouselDelivery } from '../contents/carousel'
import { ImageDelivery } from '../contents/image'
import { TextDelivery } from '../contents/text'
import { UrlDelivery } from '../contents/url'
import { DirectusClient } from '../delivery/directus-client'
import {
  ButtonFields,
  CarouselFields,
  ElementFields,
  HandoffFields,
  ImageFields,
  PayloadFields,
  TextFields,
  UrlFields,
} from './directus-contents'
import { QueueDelivery } from '../contents/queue'
import { HandoffDelivery } from '../contents/handoff'

export interface ContentDeliveries {
  [cms.ContentType.TEXT]: TextDelivery
  [cms.ContentType.IMAGE]: ImageDelivery
  [cms.ContentType.CAROUSEL]: CarouselDelivery
  [cms.ContentType.URL]: UrlDelivery
  [cms.ContentType.QUEUE]: QueueDelivery
  [cms.ContentType.HANDOFF]: HandoffDelivery
}

export class ContentsDelivery {
  readonly client: DirectusClient
  readonly ContentDeliveries: ContentDeliveries
  constructor(client: DirectusClient, ContentDeliveries: ContentDeliveries) {
    this.client = client
    this.ContentDeliveries = ContentDeliveries
  }

  async topContents(
    contentType: cms.MessageContentType,
    context: cms.SupportedLocales
  ): Promise<Content[]> {
    const entries = await this.client.topContents(contentType, context)
    return this.fromEntry(entries, contentType, context)
  }

  fromEntry(
    entries: PartialItem<any>[],
    contentType: cms.MessageContentType,
    context: cms.SupportedLocales
  ): Content[] {
    const convertedEntries: Content[] = []
    entries.forEach((entry: PartialItem<any>) => {
      convertedEntries.push(
        this.ContentDeliveries[contentType].fromEntry(entry, context)
      )
    })
    return convertedEntries
  }

  async deleteContent(contentId: ContentId) {
    await this.client.deleteContent(contentId)
  }

  async createContent(contentId: ContentId) {
    await this.client.createContent(contentId)
  }

  async updateUrlFields(
    context: cms.SupportedLocales,
    id: string,
    fields: UrlFields,
    applyToAllLocales: boolean
  ): Promise<void> {
    const convertedFields = await this.convertUrlFields(
      context,
      fields,
      id,
      applyToAllLocales
    )
    await this.client.updateFields(
      context,
      cms.ContentType.URL,
      id,
      convertedFields
    )
  }
  async updatePayloadFields(
    context: cms.SupportedLocales,
    id: string,
    fields: PayloadFields,
    applyToAllLocales: boolean
  ): Promise<void> {
    const convertedFields = await this.convertPayloadFields(
      context,
      fields,
      id,
      applyToAllLocales
    )
    await this.client.updateFields(
      context,
      cms.ContentType.PAYLOAD,
      id,
      convertedFields
    )
  }

  async updateTextFields(
    context: cms.SupportedLocales,
    id: string,
    fields: TextFields,
    applyToAllLocales: boolean
  ): Promise<void> {
    const convertedFields = await this.convertTextFields(
      context,
      fields,
      id,
      applyToAllLocales
    )
    await this.client.updateFields(
      context,
      cms.ContentType.TEXT,
      id,
      convertedFields
    )
  }

  async updateButtonFields(
    context: cms.SupportedLocales,
    id: string,
    fields: ButtonFields,
    applyToAllLocales: boolean
  ): Promise<void> {
    const convertedFields = await this.convertButtonFields(
      context,
      fields,
      id,
      applyToAllLocales
    )
    await this.client.updateFields(
      context,
      cms.ContentType.BUTTON,
      id,
      convertedFields
    )
  }

  async updateImageFields(
    context: cms.SupportedLocales,
    id: string,
    fields: ImageFields,
    applyToAllLocales: boolean
  ): Promise<void> {
    const convertedFields = await this.convertImageFields(
      context,
      fields,
      id,
      applyToAllLocales
    )
    await this.client.updateFields(
      context,
      cms.ContentType.IMAGE,
      id,
      convertedFields
    )
  }

  async updateCarouselFields(
    context: cms.SupportedLocales,
    id: string,
    fields: CarouselFields,
    applyToAllLocales: boolean
  ): Promise<void> {
    const convertedFields = await this.convertCarouselFields(
      context,
      fields,
      id,
      applyToAllLocales
    )
    await this.client.updateFields(
      context,
      cms.ContentType.CAROUSEL,
      id,
      convertedFields
    )
  }

  async updateElementFields(
    context: cms.SupportedLocales,
    id: string,
    fields: ElementFields,
    applyToAllLocales: boolean
  ): Promise<void> {
    const convertedFields = await this.convertElementFields(
      context,
      fields,
      id,
      applyToAllLocales
    )
    await this.client.updateFields(
      context,
      cms.ContentType.ELEMENT,
      id,
      convertedFields
    )
  }

  async updateHandoffFields(
    context: cms.SupportedLocales,
    id: string,
    fields: HandoffFields,
    applyToAllLocales: boolean
  ): Promise<void> {
    const convertedFields = await this.convertHandoffFields(
      context,
      fields,
      id,
      applyToAllLocales
    )
    await this.client.updateFields(
      context,
      cms.ContentType.HANDOFF,
      id,
      convertedFields
    )
  }

  async createAsset(
    context: cms.SupportedLocales,
    file: string | ArrayBuffer | Stream,
    info: AssetInfo
  ): Promise<void> {
    await this.client.createAsset(context, file, info)
  }

  private async convertUrlFields(
    context: cms.SupportedLocales,
    fields: UrlFields,
    id: string,
    applyToAllLocales: boolean
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.URL)

    const locales = applyToAllLocales
      ? await this.client.getLocales()
      : [context]

    locales.forEach((locale: cms.SupportedLocales) => {
      let localeContent = this.getLocaleContent(entry, locale)

      const isActualLocale = locale === context

      if (localeContent === undefined) {
        localeContent = {
          languages_code: locale,
        }
        entry.multilanguage_fields.push(localeContent)
      }
      if (fields.url && isActualLocale) {
        localeContent.url = fields.url
      }
    })
    if (fields.name) {
      entry.name = fields.name
    }

    return entry
  }

  private async convertPayloadFields(
    context: cms.SupportedLocales,
    fields: PayloadFields,
    id: string,
    applyToAllLocales: boolean
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.PAYLOAD)

    const locales = applyToAllLocales
      ? await this.client.getLocales()
      : [context]

    locales.forEach((locale: cms.SupportedLocales) => {
      let localeContent = this.getLocaleContent(entry, locale)

      const isActualLocale = locale === context

      if (localeContent === undefined) {
        localeContent = {
          languages_code: locale,
        }
        entry.multilanguage_fields.push(localeContent)
      }
      if (fields.payload && isActualLocale) {
        localeContent.payload = fields.payload
      }
    })
    return entry
  }

  private async convertHandoffFields(
    context: cms.SupportedLocales,
    fields: HandoffFields,
    id: string,
    applyToAllLocales: boolean
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.HANDOFF)

    const locales = applyToAllLocales
      ? await this.client.getLocales()
      : [context]

    locales.forEach((locale: cms.SupportedLocales) => {
      let localeContent = this.getLocaleContent(entry, locale)

      const isActualLocale = locale === context

      if (localeContent === undefined) {
        localeContent = {
          languages_code: locale,
        }
        entry.multilanguage_fields.push(localeContent)
      }

      if (fields.handoffMessage && isActualLocale) {
        localeContent.handoff_message = fields.handoffMessage
      }

      if (fields.handoffFailMessage && isActualLocale) {
        localeContent.handoff_fail_message = fields.handoffFailMessage
      }

      if (fields.shadowing && isActualLocale) {
        localeContent.shadowing = fields.shadowing
      }

      if (fields.queue) {
        localeContent.queue = [
          {
            collection: cms.ContentType.QUEUE,
            item: {
              id: fields.queue,
            },
          },
        ]
      }
      if (fields.onFinish) {
        localeContent.onfinish = [
          {
            collection: fields.onFinish.model,
            item: {
              id: fields.onFinish.id,
            },
          },
        ]
      }
    })

    if (fields.name) {
      entry.name = fields.name
    }

    return entry
  }

  private async convertTextFields(
    context: cms.SupportedLocales,
    fields: TextFields,
    id: string,
    applyToAllLocales: boolean
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.TEXT)

    const locales = applyToAllLocales
      ? await this.client.getLocales()
      : [context]

    locales.forEach((locale: cms.SupportedLocales) => {
      let localeContent = this.getLocaleContent(entry, locale)

      const isActualLocale = locale === context

      if (localeContent === undefined) {
        localeContent = {
          languages_code: locale,
        }
        entry.multilanguage_fields.push(localeContent)
      }

      if (fields.text && isActualLocale) {
        localeContent.text = fields.text
      }

      if (fields.buttons) {
        localeContent.buttons = this.addButtons(fields.buttons)
      }

      if (fields.buttonsStyle && isActualLocale) {
        localeContent.buttonsStyle = fields.buttonsStyle
      }

      if (fields.followup) {
        localeContent.followup = [
          {
            collection: fields.followup.model,
            item: {
              id: fields.followup.id,
            },
          },
        ]
      }
    })

    if (fields.name) {
      entry.name = fields.name
    }

    return entry
  }

  private addButtons(buttonsIds: string[]): PartialItem<any>[] {
    const buttons = buttonsIds.map((buttonId: string) => {
      return {
        collection: 'button',
        item: {
          id: buttonId,
        },
      }
    })
    return buttons
  }

  private async convertButtonFields(
    context: cms.SupportedLocales,
    fields: ButtonFields,
    id: string,
    applyToAllLocales: boolean
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.BUTTON)

    const locales = applyToAllLocales
      ? await this.client.getLocales()
      : [context]

    locales.forEach((locale: cms.SupportedLocales) => {
      let localeContent = this.getLocaleContent(entry, locale)

      const isActualLocale = locale === context

      if (localeContent === undefined) {
        localeContent = {
          languages_code: locale,
        }
        entry.multilanguage_fields.push(localeContent)
      }

      if (fields.text && isActualLocale) {
        localeContent.text = fields.text
      }

      if (fields.target) {
        localeContent.target = [
          {
            collection: fields.target.model,
            item: {
              id: fields.target.id,
            },
          },
        ]
      }
    })

    if (fields.name) {
      entry.name = fields.name
    }

    return entry
  }

  private async convertImageFields(
    context: cms.SupportedLocales,
    fields: ImageFields,
    id: string,
    applyToAllLocales: boolean
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.IMAGE)

    const locales = applyToAllLocales
      ? await this.client.getLocales()
      : [context]

    locales.forEach((locale: cms.SupportedLocales) => {
      let localeContent = this.getLocaleContent(entry, locale)

      const isActualLocale = locale === context

      if (localeContent === undefined) {
        localeContent = {
          languages_code: locale,
        }
        entry.multilanguage_fields.push(localeContent)
      }

      if (fields.imgUrl && isActualLocale) {
        localeContent.imgUrl = fields.imgUrl
      }

      if (fields.followup) {
        localeContent.followup = [
          {
            collection: fields.followup.model,
            item: {
              id: fields.followup.id,
            },
          },
        ]
      }
    })

    if (fields.name) {
      entry.name = fields.name
    }

    return entry
  }

  private async convertCarouselFields(
    context: cms.SupportedLocales,
    fields: CarouselFields,
    id: string,
    applyToAllLocales: boolean
  ): Promise<PartialItem<any>> {
    const entry = await this.client.getEntry(id, cms.ContentType.CAROUSEL)

    const locales = applyToAllLocales
      ? await this.client.getLocales()
      : [context]

    locales.forEach((locale: cms.SupportedLocales) => {
      let localeContent = this.getLocaleContent(entry, locale)

      if (localeContent === undefined) {
        localeContent = {
          languages_code: locale,
        }
        entry.multilanguage_fields.push(localeContent)
      }

      if (fields.elements) {
        localeContent.elements = this.addElements(fields.elements)
      }
    })

    if (fields.name) {
      entry.name = fields.name
    }

    return entry
  }

  private addElements(elementdIds: string[]): PartialItem<any>[] {
    const carouselElements = elementdIds.map((elementId: string) => {
      return {
        collection: 'element',
        item: {
          id: elementId,
        },
      }
    })
    return carouselElements
  }

  private async convertElementFields(
    context: cms.SupportedLocales,
    fields: ElementFields,
    id: string,
    applyToAllLocales: boolean
  ) {
    const entry = await this.client.getEntry(id, cms.ContentType.ELEMENT)

    const locales = applyToAllLocales
      ? await this.client.getLocales()
      : [context]

    locales.forEach((locale: cms.SupportedLocales) => {
      let localeContent = this.getLocaleContent(entry, locale)

      const isActualLocale = locale === context

      if (localeContent === undefined) {
        localeContent = {
          languages_code: locale,
        }
        entry.multilanguage_fields.push(localeContent)
      }

      if (fields.title && isActualLocale) {
        localeContent.title = fields.title
      }

      if (fields.subtitle && isActualLocale) {
        localeContent.subtitle = fields.subtitle
      }

      if (fields.image && isActualLocale) {
        localeContent.image = fields.image
      }

      if (fields.buttons) {
        localeContent.buttons = this.addButtons(fields.buttons)
      }
    })

    if (fields.name) {
      entry.name = fields.name
    }

    return entry
  }

  private getLocaleContent(
    entry: PartialItem<any>,
    context: cms.SupportedLocales
  ): PartialItem<any> {
    const localeFound = entry[mf].find(
      (localeContent: PartialItem<any>) =>
        localeContent.languages_code === context
    )
    return localeFound
  }
}
