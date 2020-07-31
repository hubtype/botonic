import path from 'path'
import {
  LocaleMigrator,
  LocaleRemover,
} from '../../../src/contentful/export/locale-migrator'
import { SpaceExport } from '../../../src/contentful/export/space-export'

const FIXTURES_BASE = path.resolve(__dirname, '__fixtures__/space-export')
describe('LocaleMigrator', () => {
  test('TEST ', () => {
    const fromFile = FIXTURES_BASE + '/entries_element_es_en_pt.json'
    // const toFile = '/tmp/entries_element_es_en_to_en.json'
    // const expectedFile =
    //   FIXTURES_BASE + '/entries_element_with_es_en_pt_expected.json'
    const spaceExport = SpaceExport.fromJsonFile(fromFile)
    const migrator = new LocaleMigrator('es', 'en')
    const remover = new LocaleRemover(['pt'])

    // act
    migrator.migrate(spaceExport)
    remover.remove(spaceExport)

    spaceExport.write('/tmp/kk.json')
  })

  test('TEST End to end', () => {
    const fromFile = FIXTURES_BASE + '/entries_element_es_en_pt.json'
    const toFile = '/tmp/entries_element_es_en_to_en.json'
    const expectedFile =
      FIXTURES_BASE + '/entries_element_with_es_en_pt_expected.json'
    const spaceExport = SpaceExport.fromJsonFile(fromFile)
    const migrator = new LocaleMigrator('es', 'en')
    const remover = new LocaleRemover(['pt'])

    // act
    migrator.migrate(spaceExport)
    remover.remove(spaceExport)

    // assert
    spaceExport.write(toFile)
    const newExport = SpaceExport.fromJsonFile(toFile)
    const expected = SpaceExport.fromJsonFile(expectedFile)
    expect(newExport).toMatchObject(expected)
  })
})
