import { Entry, EntryCollection } from 'contentful';
import * as cms from '../cms';
import { CommonFields, Context, ModelType } from '../cms';
import { SearchResult } from '../search';
import { CommonEntryFields, DeliveryApi } from './delivery-api';
import { QueueFields } from './queue';

export class KeywordsDelivery {
  constructor(private readonly delivery: DeliveryApi) {}

  async contentsWithKeywords(
    context: Context,
    modelsWithKeywords = [ModelType.TEXT, ModelType.CAROUSEL, ModelType.URL],
    modelsWithSearchableByKeywords = [ModelType.QUEUE]
  ): Promise<SearchResult[]> {
    // TODO maybe it's more efficient to get all contents (since most have keywords anyway and we normally have few non
    //  TopContents such as Buttons)
    const fromKeywords = this.entriesWithKeywords(context, modelsWithKeywords);
    const fromSearchable = this.entriesWithSearchableByKeywords(
      context,
      modelsWithSearchableByKeywords
    );
    return (await fromKeywords).concat(await fromSearchable);
  }

  private static resultFromEntry(
    entry: Entry<{ name: string; shortText: string }>,
    keywords: string[],
    priority?: number
  ): SearchResult {
    const contentModel = DeliveryApi.getContentModel(entry);
    if (!entry.fields.shortText) {
      console.error(`No shortText found ${contentModel} ${name}`);
      entry.fields.shortText = name;
    }

    const callback = DeliveryApi.callbackFromEntry(entry);
    return new SearchResult(
      callback,
      new CommonFields(entry.fields.name, {
        shortText: entry.fields.shortText,
        keywords
      }),
      priority
    );
  }

  private async entriesWithSearchableByKeywords(
    context: Context,
    models: ModelType[]
  ): Promise<SearchResult[]> {
    const getWithKeywords = (contentType: cms.ModelType) =>
      this.delivery.getEntries<QueueFields>(context, {
        // eslint-disable-next-line @typescript-eslint/camelcase
        content_type: contentType,
        'fields.searchableBy[exists]': true,
        include: 1
      });
    const promises = [];
    for (const contentType of models) {
      promises.push(getWithKeywords(contentType));
    }
    const queues = await Promise.all(promises);
    const results: SearchResult[] = [];
    for (const q of queues) {
      for (const queueFields of q.items) {
        for (const result of KeywordsDelivery.resultsFromQueue(queueFields)) {
          results.push(result);
        }
      }
    }
    return results;
  }

  private static resultsFromQueue(queue: Entry<QueueFields>): SearchResult[] {
    return queue.fields.searchableBy!.map(searchable =>
      this.resultFromEntry(
        queue,
        searchable.fields.keywords,
        searchable.fields.priority
      )
    );
  }

  private entriesWithKeywords(
    context: Context,
    models: ModelType[]
  ): Promise<SearchResult[]> {
    const getWithKeywords = (contentType: cms.ModelType) =>
      this.delivery.getEntries<CommonEntryFields>(context, {
        // eslint-disable-next-line @typescript-eslint/camelcase
        content_type: contentType,
        'fields.keywords[exists]': true,
        include: 0
      });
    const promises = [];
    for (const contentType of models) {
      promises.push(getWithKeywords(contentType));
    }
    return Promise.all(promises).then(entryCollections =>
      KeywordsDelivery.flatMapEntryCollection(entryCollections).map(entry =>
        KeywordsDelivery.resultFromEntry(entry, entry.fields.keywords || [])
      )
    );
  }

  private static flatMapEntryCollection<T>(
    collections: EntryCollection<T>[]
  ): Entry<T>[] {
    const entries = [] as Entry<T>[];
    collections.forEach(collection => entries.push(...collection.items));
    return entries;
  }
}
