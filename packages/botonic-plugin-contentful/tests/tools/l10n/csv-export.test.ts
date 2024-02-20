import sync from 'csv-stringify/lib/sync'

import { CommonFields, Url } from '../../../src/cms'
import { TextBuilder } from '../../../src/cms/factories'
import { RndButtonsBuilder } from '../../../src/cms/test-helpers'
import { ENGLISH } from '../../../src/nlp'
import {
  ContentToCsvLines,
  create_stringifier,
  CsvExport,
  skipEmptyStrings,
} from '../../../src/tools/l10n/csv-export'
import { testContentful } from '../../../tests/contentful/contentful.helper'

test('TEST: CsvExport integration test', async () => {
  const cms = testContentful()

  const exporter = new CsvExport({})
  // running for ENGLISH to test contents with empty fields
  const from = ENGLISH
  await exporter.write(`/tmp/contentful_${from}.csv`, cms, from)
}, 30000)

test('TEST: ContentToCsvLines.getCsvLines Text', () => {
  const exporter = new ContentToCsvLines({})
  const fields = exporter.getCsvLines(
    new TextBuilder('id1', 'name1', 'long text')
      .withShortText('short1')
      .withKeywords(['kw1', 'kw2'])
      .build()
  )
  expect(fields).toEqual([
    ['text', 'name1', 'id1', 'Short text', 'short1'],
    ['text', 'name1', 'id1', 'Keywords', 'kw1;kw2'],
    ['text', 'name1', 'id1', 'Text', 'long text'],
  ])
})

test('TEST: ContentToCsvLines.getCsvLines URL', () => {
  const exporter = new ContentToCsvLines({})
  const fields = exporter.getCsvLines(
    new Url(
      new CommonFields('id1', 'url1name', { shortText: 'st1' }),
      'http://url1'
    )
  )
  expect(fields).toEqual([
    ['url', 'url1name', 'id1', 'Short text', 'st1'],
    ['url', 'url1name', 'id1', 'Keywords', ''],
    ['url', 'url1name', 'id1', 'URL', 'http://url1'],
  ])
})

test('TEST: ContentToCsvLines.getI18nFields skips blank and undefined strings', () => {
  const exporter = new ContentToCsvLines({ stringFilter: skipEmptyStrings })
  const textWithoutShortText = new TextBuilder('id1', 'name1', ' ').build()
  const fields = exporter.getCsvLines(textWithoutShortText)
  expect(fields).toEqual([])
})

test('TEST: ContentToCsvLines.getI18nFields Button', () => {
  const exporter = new ContentToCsvLines({})
  const button = new RndButtonsBuilder().addButton().build()[0]
  const fields = exporter.getCsvLines(button)
  expect(fields).toEqual([
    ['button', button.name, button.id, 'Text', button.text],
  ])
})

// Skipped because push callback within sync is never called (why?), and hence it returns ""
test.skip('TEST: create_stringifier sync', () => {
  const stringifier = create_stringifier()
  const str = sync(['1 "2" 3', '4'], stringifier.options)
  expect(str).toEqual('"1 ""2"" 3","4"')
})

test('TEST: create_stringifier', () => {
  const fields: string[] = []
  // does not work with Readable.from
  // const readable = Readable.from(['1 "2" 3', '4']).pipe(exporter.stringifier)
  const stringifier = create_stringifier()
  stringifier.write(['1 "2" 3', '4'])
  stringifier.end()
  let row: Buffer
  while ((row = stringifier.read())) {
    fields.push(row.toString('utf8'))
  }

  expect(fields).toEqual([
    '"Model";"Code";"Id";"Field";"From";"To"\r\n"1 ""2"" 3";"4"\r\n',
  ])
})
