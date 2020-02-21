import { CsvExport } from '../../../src/tools/translators/csv-export'
import { testContentful } from '../../../tests/contentful/contentful.helper'
import { ENGLISH } from '../../../src/nlp'
import { TextBuilder } from '../../../src/cms/factories'
import sync from 'csv-stringify/lib/sync'
import { RndButtonsBuilder } from '../../../src/cms/test-helpers'

test('integration test', async () => {
  const cms = testContentful()
  const exporter = new CsvExport({
    // nameFilter: n => ['HOME_RETURN_URL'].includes(n),
  })
  const from = ENGLISH
  await exporter.write(`contentful_${from}.csv`, cms, from)
})

test('getI18nFields Text', () => {
  const exporter = new CsvExport({
    nameFilter: n => ['HOME_RETURN_URL'].includes(n),
  })
  const fields = exporter.getI18nFields(
    new TextBuilder('id1', 'name1', 'long text').withShortText('short1').build()
  )
  expect(fields).toEqual([
    ['text', 'id1', 'name1', 'Short text', 'short1'],
    ['text', 'id1', 'name1', 'Text', 'long text'],
  ])
})

test('getI18nFields Button', () => {
  const exporter = new CsvExport({
    nameFilter: n => ['HOME_RETURN_URL'].includes(n),
  })
  const button = new RndButtonsBuilder().withButton().build()[0]
  const fields = exporter.getI18nFields(button)
  expect(fields).toEqual([
    ['button', button.id, button.name, 'Text', button.text],
  ])
})

// returns "" because push callback within sync is never called. why?
test.skip('stringifier sync', () => {
  const exporter = new CsvExport({
    nameFilter: n => ['HOME_RETURN_URL'].includes(n),
  })
  const stringifier = exporter.create_stringifier()
  const str = sync(['1 "2" 3', '4'], stringifier.options)
  expect(str).toEqual('"1 ""2"" 3","4"')
  // readable.pipe().pip
})

test('stringifier', () => {
  const exporter = new CsvExport({
    nameFilter: n => ['HOME_RETURN_URL'].includes(n),
  })
  const fields = []
  // does not work with Readable.from
  // const readable = Readable.from(['1 "2" 3', '4']).pipe(exporter.stringifier)
  const stringifier = exporter.create_stringifier()
  stringifier.write(['1 "2" 3', '4'])
  stringifier.end()
  let row: Buffer
  while ((row = stringifier.read())) {
    fields.push(row.toString('utf8'))
  }

  expect(fields).toEqual([
    '"Model";"Id";"Code";"Field";"From";"To"\r\n"1 ""2"" 3";"4"\r\n',
  ])
})
