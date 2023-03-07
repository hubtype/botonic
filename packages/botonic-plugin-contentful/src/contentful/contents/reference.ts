import { Entry } from 'contentful'

import * as cms from '../../cms'
import { ContentType } from '../../cms'
import { TopContentDelivery } from '../content-delivery'
import { DeliveryApi } from '../delivery-api'
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  DateRangeFields,
  FollowUpFields,
  ReferenceFields,
} from '../delivery-utils'
import { CarouselDelivery } from './carousel'
import { DateRangeDelivery } from './date-range'
import { DocumentDelivery, DocumentFields } from './document'
import { HandoffDelivery, HandoffFields } from './handoff'
import { ImageDelivery, ImageFields } from './image'
import { InputDelivery, InputFields } from './input'
import { PayloadDelivery, PayloadFields } from './payload'
import { QueueDelivery, QueueFields } from './queue'
import { ScheduleDelivery, ScheduleFields } from './schedule'
import { StartUpDelivery, StartUpFields } from './startup'
import { TextDelivery, TextFields } from './text'
import { UrlDelivery, UrlFields } from './url'
import { VideoDelivery, VideoFields } from './video'

export class DeliveryWithReference extends TopContentDelivery {
  reference: ReferenceDelivery | undefined

  // cannot be set in constructor because there's a circular dependency Model <-> Reference
  setReference(reference: ReferenceDelivery) {
    this.reference = reference
  }

  getReference(): ReferenceDelivery {
    console.assert(
      this.reference,
      'you need to call setReference from Contentful constructor'
    )
    return this.reference!
  }
}

export class ReferenceDelivery {
  constructor(
    private readonly delivery: DeliveryApi,
    private readonly carousel: CarouselDelivery,
    private readonly text: TextDelivery,
    private readonly image: ImageDelivery,
    private readonly startUp: StartUpDelivery,
    private readonly video: VideoDelivery,
    private readonly document: DocumentDelivery,
    private readonly url: UrlDelivery,
    private readonly handoff: HandoffDelivery,
    private readonly queue: QueueDelivery,
    private readonly schedule: ScheduleDelivery,
    private readonly input: InputDelivery,
    private readonly payload: PayloadDelivery,
    private readonly dateRange: DateRangeDelivery
  ) {}

  async fromEntry(
    reference: Entry<ReferenceFields> | undefined,
    context: cms.Context
  ): Promise<cms.Reference | undefined> {
    if (!reference) {
      return Promise.resolve(undefined)
    }
    try {
      return this.fromEntryCore(reference, context)
    } catch (e) {
      throw new cms.CmsException(
        `Error loading reference with id '${reference.sys.id}'`,
        e
      )
    }
  }

  async commonFields(entry: Entry<CommonEntryFields>, context: cms.Context) {
    const reference = await this.getReference(entry, context)
    return ContentfulEntryUtils.commonFieldsFromEntry(entry, reference)
  }

  async fromEntryCore(
    reference: Entry<ReferenceFields>,
    context: cms.Context
  ): Promise<cms.Reference | undefined> {
    if (!reference.sys.contentType) {
      reference = await this.delivery.getEntry(reference.sys.id, context)
    }
    switch (ContentfulEntryUtils.getContentModel(reference)) {
      case ContentType.CAROUSEL:
        // here followUp already has its fields set, but not yet its element fields
        return this.carousel.carousel(reference.sys.id, context)
      case cms.ContentType.TEXT:
        return this.text.fromEntry(reference as Entry<TextFields>, context)
      case cms.ContentType.IMAGE:
        return this.image.fromEntry(reference as Entry<ImageFields>, context)
      case cms.ContentType.STARTUP:
        return this.startUp.fromEntry(
          reference as Entry<StartUpFields>,
          context
        )
      case cms.ContentType.VIDEO:
        return this.video.fromEntry(reference as Entry<VideoFields>, context)
      case cms.ContentType.DOCUMENT:
        return this.document.fromEntry(
          reference as Entry<DocumentFields>,
          context
        )
      case cms.ContentType.URL:
        return this.url.fromEntry(reference as Entry<UrlFields>, context)
      case cms.ContentType.HANDOFF:
        return this.handoff.fromEntry(
          reference as Entry<HandoffFields>,
          context
        )

      case cms.ContentType.QUEUE:
        return this.queue.fromEntry(reference as Entry<QueueFields>, context)
      case cms.ContentType.SCHEDULE:
        return this.schedule.fromEntry(
          reference as Entry<ScheduleFields>,
          context
        )
      case cms.ContentType.INPUT:
        return this.input.fromEntry(reference as Entry<InputFields>, context)
      case cms.ContentType.PAYLOAD:
        return this.payload.fromEntry(
          reference as Entry<PayloadFields>,
          context
        )
      case cms.ContentType.DATE_RANGE:
        return this.dateRange.fromEntry(
          reference as Entry<DateRangeFields>,
          context
        )

      default:
        throw new Error(`Unexpected reference type ${reference.sys.type}`)
    }
  }

  private async getReference(
    entry: Entry<CommonEntryFields>,
    context: cms.Context
  ): Promise<cms.FollowUp | undefined> {
    if (entry.fields.followup) {
      const followUp = entry.fields.followup.sys.contentType
        ? entry.fields.followup
        : await this.delivery.getEntry<FollowUpFields>(
            entry.fields.followup.sys.id,
            context
          )

      return (await this.fromEntry(followUp, context)) as cms.FollowUp
    }
    return undefined
  }
}
