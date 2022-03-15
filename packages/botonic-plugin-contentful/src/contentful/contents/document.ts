import * as contentful from 'contentful'

import * as cms from '../../cms'
import { ContentType } from '../../cms'
import { DeliveryApi } from '../delivery-api'
import { addCustomFields, CommonEntryFields } from '../delivery-utils'
import { DeliveryWithFollowUp } from './follow-up'

export class DocumentDelivery extends DeliveryWithFollowUp {
  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(ContentType.DOCUMENT, delivery, resumeErrors)
  }

  async document(id: string, context: cms.Context): Promise<cms.Document> {
    const entry: contentful.Entry<DocumentFields> = await this.getEntry(
      id,
      context
    )
    return this.fromEntry(entry, context)
  }

  async fromEntry(
    entry: contentful.Entry<DocumentFields>,
    context: cms.Context
  ): Promise<cms.Document> {
    return addCustomFields(
      new cms.Document(
        await this.getFollowUp().commonFields(entry, context),
        this.urlFromAssetOptional(entry.fields.document, context)
      ),
      entry.fields,
      ['document']
    )
  }
}

export interface DocumentFields extends CommonEntryFields {
  document: contentful.Asset
}
