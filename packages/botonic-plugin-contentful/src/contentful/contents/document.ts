import * as contentful from 'contentful'

import * as cms from '../../cms'
import { ContentType } from '../../cms'
import { DeliveryApi } from '../delivery-api'
import { addCustomFields, CommonEntryFields } from '../delivery-utils'
import { DeliveryWithReference } from './reference'

export class DocumentDelivery extends DeliveryWithReference {
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
    const referenceDelivery = {
      delivery: this.reference!,
      context,
    }
    return addCustomFields(
      new cms.Document(
        await this.getReference().commonFields(entry, context),
        this.urlFromAssetRequired(entry.fields.document)
      ),
      entry.fields,
      referenceDelivery,
      ['document']
    )
  }
}

export interface DocumentFields extends CommonEntryFields {
  document: contentful.Asset
}
