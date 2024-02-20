import * as contentful from 'contentful'

import * as cms from '../../cms'
import { CustomFields } from '../../cms'
import { ContentDelivery } from '../content-delivery'
import { ContentWithNameFields } from '../delivery-utils'
import { DeliveryApi } from '../index'

export class CustomDelivery extends ContentDelivery {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.CustomContentType.CUSTOM, delivery, resumeErrors)
  }

  public async custom(id: string, context: cms.Context): Promise<cms.Custom> {
    const entry = await this.getEntry<ContentWithCustomFields>(id, context)
    return this.fromEntry(entry, context)
  }

  public fromEntry(
    customEntry: contentful.Entry<ContentWithCustomFields>,
    _context: cms.Context
  ): cms.Custom {
    return new cms.Custom(
      customEntry.sys.id,
      customEntry.fields.name,
      this.getCustomFields(customEntry.fields)
    )
  }

  private getCustomFields(entryFields: ContentWithCustomFields): CustomFields {
    const { name, ...fields } = entryFields
    return fields ? fields : {}
  }
}

export type ContentWithCustomFields = ContentWithNameFields & CustomFields
