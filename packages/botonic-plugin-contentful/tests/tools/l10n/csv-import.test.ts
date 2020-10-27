import path from 'path'
import { anything, instance, mock, when } from 'ts-mockito'

import * as cms from '../../../src/cms'
import { ContentFieldType } from '../../../src/manage-cms/fields'
import { CsvImport, Record } from '../../../src/tools/l10n/csv-import'
import { StringFieldImporter } from '../../../src/tools/l10n/string-field-importer'

const FIXTURES_BASE = path.resolve(__dirname, '__fixtures__')

test('TEST: CsvImport read text, URL & carousel', async () => {
  const mockFieldImporter = mock<StringFieldImporter>()
  const readLines: Record[] = []
  let flushCount = 0
  when(mockFieldImporter.consume(anything())).thenCall((record: Record) => {
    readLines.push(record)
  })
  when(mockFieldImporter.flush()).thenCall(() => {
    flushCount++
  })
  const importer = new CsvImport(instance(mockFieldImporter), undefined)
  // running for ENGLISH to test contents with empty fields
  await importer.import(`${FIXTURES_BASE}/contentful_es-pl.csv`)
  expect(readLines.length).toEqual(5)
  expect(readLines[0]).toEqual({
    Model: cms.ContentType.TEXT,
    Code: 'POST_FAQ1',
    Id: 'id1',
    Field: ContentFieldType.SHORT_TEXT,
    from: 'from',
    to: 'válor1',
  } as Record)
  expect(readLines[1]).toEqual({
    Model: cms.ContentType.TEXT,
    Code: 'POST_FAQ1',
    Id: 'id1',
    Field: ContentFieldType.KEYWORDS,
    from: 'from',
    to: 'kw1;hola,amigo',
  } as Record)
  expect(readLines[2]).toEqual({
    Model: cms.ContentType.CAROUSEL,
    Code: 'POST_FAQ2',
    Id: 'id2',
    Field: ContentFieldType.TEXT,
    from: 'from',
    to: 'válor2',
  } as Record)
  expect(readLines[3]).toEqual({
    Model: cms.ContentType.URL,
    Code: 'URL1',
    Id: 'id3',
    Field: ContentFieldType.SHORT_TEXT,
    from: 'from',
    to: 'st1',
  } as Record)
  expect(readLines[4]).toEqual({
    Model: cms.ContentType.URL,
    Code: 'URL1',
    Id: 'id3',
    Field: ContentFieldType.URL,
    from: 'http://url1',
    to: 'http://url2',
  } as Record)
  expect(flushCount).toEqual(1)
})
