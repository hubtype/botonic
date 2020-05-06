import { Entry, EntryCollection } from 'contentful/index'
import * as cms from '../../cms'
import { CommonFields, TopContentId, Context, TopContentType } from '../../cms'
import { SearchCandidate } from '../../search'
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  DeliveryApi,
} from '../delivery-api'
import { QueueFields } from '../contents/queue'
import { ContentType } from '../../cms/cms'

export class KeywordsDelivery {
  constructor(private readonly delivery: DeliveryApi) {}

  async contentsWithKeywords(
    context: Context,
    modelsWithKeywords = [
      ContentType.TEXT,
      ContentType.CAROUSEL,
      ContentType.URL,
    ],
    modelsWithSearchableByKeywords = [ContentType.QUEUE]
  ): Promise<SearchCandidate[]> {
    // TODO maybe it's more efficient to get all contents (since most have keywords anyway and we normally have few non
    //  TopContents such as Buttons)
    const fromKeywords = this.entriesWithKeywords(context, modelsWithKeywords)
    const fromSearchable = this.entriesWithSearchableByKeywords(
      context,
      modelsWithSearchableByKeywords
    )
    return (await fromKeywords).concat(await fromSearchable)
  }

  private static candidateFromEntry(
    entry: Entry<CommonEntryFields>,
    keywords: string[],
    priority?: number
  ): SearchCandidate {
    const contentModel = ContentfulEntryUtils.getContentModel<TopContentType>(
      entry
    )
    if (!entry.fields.shortText) {
      console.error(
        `No shortText found for content of type ${contentModel} and name: ${entry.fields.name}`
      )
      entry.fields.shortText = entry.fields.name
    }

    const contentId = new TopContentId(contentModel, entry.sys.id)
    return new SearchCandidate(
      contentId,
      new CommonFields(contentId.id, entry.fields.name, {
        shortText: entry.fields.shortText,
        keywords,
      }),
      priority
    )
  }

  private async entriesWithSearchableByKeywords(
    context: Context,
    models: TopContentType[]
  ): Promise<SearchCandidate[]> {
    const getWithKeywords = (contentType: cms.TopContentType) =>
      this.delivery.getEntries<QueueFields>(context, {
        // eslint-disable-next-line @typescript-eslint/camelcase
        content_type: contentType,
        'fields.searchableBy[exists]': true,
        include: 1,
      })
    const promises = []
    for (const contentType of models) {
      promises.push(getWithKeywords(contentType))
    }
    const queues = await Promise.all(promises)
    const results: SearchCandidate[] = []
    for (const q of queues) {
      for (const queueFields of q.items) {
        for (const result of KeywordsDelivery.candidatesFromQueue(
          queueFields
        )) {
          results.push(result)
        }
      }
    }
    return results
  }

  private static candidatesFromQueue(
    queue: Entry<QueueFields>
  ): SearchCandidate[] {
    return queue.fields.searchableBy!.map(searchable =>
      this.candidateFromEntry(
        queue,
        searchable.fields.keywords,
        searchable.fields.priority
      )
    )
  }

  private entriesWithKeywords(
    context: Context,
    models: TopContentType[]
  ): Promise<SearchCandidate[]> {
    const getWithKeywords = (contentType: cms.TopContentType) =>
      this.delivery.getEntries<CommonEntryFields>(context, {
        // eslint-disable-next-line @typescript-eslint/camelcase
        content_type: contentType,
        'fields.keywords[exists]': true,
        include: 0,
      })
    const promises = []
    for (const contentType of models) {
      promises.push(getWithKeywords(contentType))
    }
    return Promise.all(promises).then(entryCollections =>
      KeywordsDelivery.flatMapEntryCollection(entryCollections).map(entry =>
        KeywordsDelivery.candidateFromEntry(entry, entry.fields.keywords || [])
      )
    )
  }

  private static flatMapEntryCollection<T>(
    collections: EntryCollection<T>[]
  ): Entry<T>[] {
    const entries = [] as Entry<T>[]
    collections.forEach(collection => entries.push(...collection.items))
    return entries
  }
}
