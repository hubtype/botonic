import * as contentful from 'contentful'
import { ContentWithNameFields } from '../delivery-utils'

import * as cms from '../../cms'

import { ContentDelivery } from '../content-delivery'
import { DeliveryApi } from '../index'

export class CustomDelivery extends ContentDelivery {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(cms.ContentType.CUSTOM, delivery, resumeErrors)
  }

  public async custom(id: string, context: cms.Context): Promise<cms.Custom> {
    const entry = await this.getEntry<CustomFields>(id, context)
    return this.fromEntry(entry)
  }

  public fromEntry(customEntry: contentful.Entry<CustomFields>): cms.Custom {
    return new cms.Custom(
      customEntry.sys.id,
      customEntry.fields.name,
      this.getCustomFields(customEntry.fields)
    )
  }

  private getCustomFields(fields: CustomFields): Record<string, unknown> | {} {
    const { name, ...customFields } = fields
    return customFields ? customFields : {}
  }
}

export interface CustomFields extends ContentWithNameFields {
  customFields: Record<string, unknown> | undefined
}
