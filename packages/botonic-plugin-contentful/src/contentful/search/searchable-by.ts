import { Entry } from 'contentful'

import * as cms from '../../cms'
import { ContentWithNameFields } from '../delivery-api'

export class SearchableByKeywordsDelivery {
  static fromEntry(
    entry: Entry<SearchableByKeywordsFields>
  ): cms.SearchableByKeywords {
    const fields = entry.fields
    return new cms.SearchableByKeywords(
      fields.name,
      fields.keywords,
      fields.priority
    )
  }
}

export interface SearchableByKeywordsFields extends ContentWithNameFields {
  keywords: string[]
  priority: number
}
