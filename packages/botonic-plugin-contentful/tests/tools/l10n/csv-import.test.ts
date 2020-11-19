import path from 'path'
import { anything, instance, mock, when } from 'ts-mockito'

import { ContentType } from '../../../src/cms'
import { ContentFieldType } from '../../../src/manage-cms/fields'
import {
  CsvImport,
  Record,
  RecordFixer,
} from '../../../src/tools/l10n/csv-import'
import { ImportRecordReducer } from '../../../src/tools/l10n/import-updater'

const FIXTURES_BASE = path.resolve(__dirname, '__fixtures__')

test('TEST: CsvImport read text, URL & carousel', async () => {
  const mockFieldImporter = mock<ImportRecordReducer>()
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
  await importer.import({ fname: `${FIXTURES_BASE}/contentful_es-pl.csv` })
  expect(readLines.length).toEqual(5)
  // they're read sorting them by model/code
  expect(readLines[0]).toEqual({
    Model: ContentType.CAROUSEL,
    Code: 'POST_FAQ2',
    Id: 'id2',
    Field: ContentFieldType.TEXT,
    from: 'from',
    to: 'válor2',
  } as Record)
  expect(readLines[1]).toEqual({
    Model: ContentType.TEXT,
    Code: 'POST_FAQ1',
    Id: 'id1',
    Field: ContentFieldType.SHORT_TEXT,
    from: 'from',
    to: 'válor1',
  } as Record)
  expect(readLines[2]).toEqual({
    Model: ContentType.TEXT,
    Code: 'POST_FAQ1',
    Id: 'id1',
    Field: ContentFieldType.KEYWORDS,
    from: 'from',
    to: 'kw1;hola,amigo',
  } as Record)
  expect(readLines[3]).toEqual({
    Model: ContentType.URL,
    Code: 'URL1',
    Id: 'id3',
    Field: ContentFieldType.SHORT_TEXT,
    from: 'from',
    to: 'st1',
  } as Record)
  expect(readLines[4]).toEqual({
    Model: ContentType.URL,
    Code: 'URL1',
    Id: 'id3',
    Field: ContentFieldType.URL,
    from: 'http://url1',
    to: 'http://url2',
  } as Record)
  expect(flushCount).toEqual(1)
})

describe('RecordFixer', () => {
  test('TEST: RecordFixer', () => {
    const record = {
      Model: ContentType.TEXT,
      Code: 'code1',
      Id: 'id1',
      Field: ContentFieldType.KEYWORDS,
      from: 'k1;k2',
      to: 'k1,k2',
    }
    const sut = new RecordFixer(record)

    // act
    sut.fix()

    // assert
    expect(record.to).toEqual('k1;k2')
  })
})
