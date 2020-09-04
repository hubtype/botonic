import path from 'path'
import {
  LocaleMigrator,
  LocaleRemover,
} from '../../../src/contentful/export/locale-migrator'
import { SpaceExport } from '../../../src/contentful/export/space-export'

const FIXTURES_BASE = path.resolve(__dirname, '__fixtures__/space-export')
describe('LocaleMigrator', () => {
  test('TEST: LocaleMigrator some fields are falsy', () => {
    const fromFile = FIXTURES_BASE + '/entries_hour_range.json'
    const toFile = '/tmp/entries_hour_range.json'
    const expectedFile = FIXTURES_BASE + '/entries_hour_range_expected.json'
    const spaceExport = SpaceExport.fromJsonFile(fromFile)
    const migrator = new LocaleMigrator('en', 'it', true)
    const remover = new LocaleRemover(['pt', 'es', 'pl'], 'it')

    // act
    migrator.migrate(spaceExport)
    remover.remove(spaceExport)

    // assert
    spaceExport.write(toFile)
    const newExport = SpaceExport.fromJsonFile(toFile)
    const expected = SpaceExport.fromJsonFile(expectedFile)
    expect(newExport).toEqual(expected)
  })

  test('TEST: LocaleMigrator/Remover es->en', () => {
    const fromFile = FIXTURES_BASE + '/entries_element_es_en_pt.json'
    const toFile = '/tmp/entries_element_es_en_to_en.json'
    const expectedFile =
      FIXTURES_BASE + '/entries_element_with_es_en_pt_expected.json'
    const spaceExport = SpaceExport.fromJsonFile(fromFile)
    const migrator = new LocaleMigrator('es', 'en', true)
    const remover = new LocaleRemover(['pt'], 'en')

    // act
    migrator.migrate(spaceExport)
    remover.remove(spaceExport)

    // assert
    spaceExport.write(toFile)
    const newExport = SpaceExport.fromJsonFile(toFile)
    const expected = SpaceExport.fromJsonFile(expectedFile)
    expect(newExport).toEqual(expected)
  })

  test('TEST: LocaleMigrator/Remover en->nl', () => {
    const fromFile = FIXTURES_BASE + '/entries_element_es_en_pt.json'
    const toFile = '/tmp/entries_element_with_es_en_pt_to_nl.json'
    const expectedFile =
      FIXTURES_BASE + '/entries_element_with_es_en_pt_expected_nl.json'
    const spaceExport = SpaceExport.fromJsonFile(fromFile)
    const migrator = new LocaleMigrator('en', 'nl', true)
    const remover = new LocaleRemover(['pt', 'es'], 'nl')

    // act
    migrator.migrate(spaceExport)
    remover.remove(spaceExport)

    // assert
    spaceExport.write(toFile)
    const newExport = SpaceExport.fromJsonFile(toFile)
    const expected = SpaceExport.fromJsonFile(expectedFile)
    expect(newExport).toEqual(expected)
  })

  test('TEST: LocaleMigrator/Remover en->en', () => {
    const fromFile = FIXTURES_BASE + '/entries_element_es_en_pt.json'
    const toFile = '/tmp/entries_element_with_es_en_pt_to_en.json'
    const expectedFile =
      FIXTURES_BASE + '/entries_element_es_en_pt_to_en_expected.json'
    const spaceExport = SpaceExport.fromJsonFile(fromFile)
    const migrator = new LocaleMigrator('en', 'en', true)
    const remover = new LocaleRemover(['pt', 'es'], 'en')

    // act
    migrator.migrate(spaceExport)
    remover.remove(spaceExport)

    // assert
    spaceExport.write(toFile)
    const newExport = SpaceExport.fromJsonFile(toFile)
    const expected = SpaceExport.fromJsonFile(expectedFile)
    expect(newExport).toEqual(expected)
  })
})
