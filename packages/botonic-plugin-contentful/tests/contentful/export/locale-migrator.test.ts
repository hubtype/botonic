import path from 'path'
import { ExportObject } from '../../../src/contentful/export/export-object'
import { LocaleMigrator } from '../../../src/contentful/export/locale-migrator'

const FIXTURES_BASE = path.resolve(__dirname, '__fixtures__')
describe('LocaleMigrater', () => {
  test('TEST End to end', async () => {
    const fromFile = FIXTURES_BASE + '/entries_element_es_en.json'
    const toFile = '/tmp/entries_element_es_en_to_en.json'
    const expectedFile =
      FIXTURES_BASE + '/entries_element_with_es_en_expected.json'
    const exportObj = ExportObject.fromJsonFile(fromFile)
    const sut = new LocaleMigrator('es', 'en', ['pt'])

    // act
    sut.migrate(exportObj)
    exportObj.write(toFile)

    // assert
    const newExport = ExportObject.fromJsonFile(toFile)
    const expected = ExportObject.fromJsonFile(expectedFile)
    expect(newExport).toMatchObject(expected)
  })
})
