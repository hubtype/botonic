import { Entry } from 'contentful'

import * as cms from '../../cms'
import { CmsException, ContentType } from '../../cms'
import { TopContentDelivery } from '../content-delivery'
import { DeliveryApi } from '../delivery-api'
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  FollowUpFields,
} from '../delivery-utils'
import { CarouselDelivery } from './carousel'
import { ImageDelivery, ImageFields } from './image'
import { StartUpDelivery, StartUpFields } from './startup'
import { TextDelivery, TextFields } from './text'

export class DeliveryWithFollowUp extends TopContentDelivery {
  followUp: FollowUpDelivery | undefined

  // cannot be set in constructor because there's a circular dependency Model <-> Followup
  setFollowUp(followUp: FollowUpDelivery) {
    this.followUp = followUp
  }

  getFollowUp(): FollowUpDelivery {
    console.assert(
      this.followUp,
      'you need to call setFollowUp from Contentful constructor'
    )
    return this.followUp!
  }
}

export class FollowUpDelivery {
  constructor(
    private readonly delivery: DeliveryApi,
    private readonly carousel: CarouselDelivery,
    private readonly text: TextDelivery,
    private readonly image: ImageDelivery,
    private readonly startUp: StartUpDelivery
  ) {}

  async fromEntry(
    followUp: Entry<FollowUpFields> | undefined,
    context: cms.Context
  ): Promise<cms.FollowUp | undefined> {
    if (!followUp) {
      return Promise.resolve(undefined)
    }
    try {
      return this.fromEntryCore(followUp, context)
    } catch (e) {
      throw new CmsException(
        `Error loading followup with id '${followUp.sys.id}'`,
        e
      )
    }
  }

  // TODO we should detect cycles to avoid infinite recursion
  async fromEntryCore(
    followUp: Entry<FollowUpFields>,
    context: cms.Context
  ): Promise<cms.FollowUp | undefined> {
    if (!followUp.sys.contentType) {
      followUp = await this.delivery.getEntry(followUp.sys.id, context)
    }
    switch (ContentfulEntryUtils.getContentModel(followUp)) {
      case ContentType.CAROUSEL:
        // here followUp already has its fields set, but not yet its element fields
        return this.carousel.carousel(followUp.sys.id, context)
      case cms.ContentType.TEXT:
        return this.text.fromEntry(followUp as Entry<TextFields>, context)
      case cms.ContentType.IMAGE:
        return this.image.fromEntry(followUp as Entry<ImageFields>, context)
      case cms.ContentType.STARTUP:
        return this.startUp.fromEntry(followUp as Entry<StartUpFields>, context)
      default:
        throw new Error(`Unexpected followUp type ${followUp.sys.type}`)
    }
  }

  async commonFields(entry: Entry<CommonEntryFields>, context: cms.Context) {
    const followUp = await this.getFollowUp(entry, context)
    return ContentfulEntryUtils.commonFieldsFromEntry(entry, followUp)
  }

  private async getFollowUp(
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
