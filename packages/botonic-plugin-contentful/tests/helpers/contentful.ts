import * as contentful from 'contentful';
import { Entry, EntryCollection } from 'contentful';

/**
 * Required because ts-mockito cannot mock interfaces
 */
export class DummyContentfulClientApi
  implements contentful.ContentfulClientApi {
  getAsset(id: string, query?: any): Promise<contentful.Asset> {
    throw new Error('not implemented');
  }

  getAssets(query?: any): Promise<contentful.AssetCollection> {
    throw new Error('not implemented');
  }

  getContentType(id: string): Promise<contentful.ContentType> {
    throw new Error('not implemented');
  }

  getContentTypes(query?: any): Promise<contentful.ContentTypeCollection> {
    throw new Error('not implemented');
  }

  getEntries<T>(query?: any): Promise<contentful.EntryCollection<T>> {
    throw new Error('not implemented');
  }

  getEntry<T>(id: string, query?: any): Promise<contentful.Entry<T>> {
    throw new Error('not implemented');
  }

  getLocales(): Promise<contentful.LocaleCollection> {
    throw new Error('not implemented');
  }

  getSpace(): Promise<contentful.Space> {
    throw new Error('not implemented');
  }

  sync(query: any): Promise<contentful.SyncCollection> {
    throw new Error('not implemented');
  }
}

export function entryCollection(
  ...entries: Entry<any>[]
): EntryCollection<any> {
  let collection = ({
    items: entries
  } as any) as EntryCollection<any>;
  return collection;
}

export function entry(
  id: string,
  contentType: string,
  name: string,
  otherFields?: {}
): Entry<any> {
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  let entry = {
    sys: {
      id,
      contentType: {
        sys: {
          id: contentType
        }
      }
    },
    fields: { name: name }
  } as Entry<any>;
  entry.fields = { ...entry.fields, ...otherFields };
  return entry;
}
