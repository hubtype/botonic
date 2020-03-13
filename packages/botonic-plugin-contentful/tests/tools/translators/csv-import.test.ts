import path from 'path'
import {
  CsvImport,
  Record,
  StringFieldImporter,
} from '../../../src/tools/translators/csv-import'
import { anything, instance, mock, when } from 'ts-mockito'
import { testManageContentful } from '../../contentful/manage/manage-contentful.helper'
import { SPANISH } from '../../../src/nlp'
import * as cms from '../../../src/cms'
import { testContentful } from '../../contentful/contentful.helper'
import { ManageCms } from '../../../src/manage-cms/manage-cms'
import { ContentFieldType } from '../../../src/manage-cms/fields'
import { ManageContext } from '../../../src/manage-cms/manage-context'
import { ContentId } from '../../../src/cms'

const TEST_CSV_IMPORT_ID = '3LOUB5Udmxw7rh87G5Ob9b'
const FIXTURES_BASE = path.resolve(__dirname, '__fixtures__')

function ctxt(ctx: Partial<ManageContext>): ManageContext {
  return { ...ctx, preview: false } as ManageContext
}

describe('ManageContentful', () => {
  test('TEST: CsvImport read text & carousel', async () => {
    const mockFieldImporter = mock<StringFieldImporter>()
    const readLines: Record[] = []
    when(mockFieldImporter.consume(anything())).thenCall((record: Record) => {
      console.log(record.Code, record.Field, record.to)
      readLines.push(record)
    })
    const importer = new CsvImport(instance(mockFieldImporter))
    // running for ENGLISH to test contents with empty fields
    await importer.import(`${FIXTURES_BASE}/contentful_es-pl.csv`)
    expect(readLines.length).toEqual(3)
    expect(readLines[0]).toEqual({
      Model: 'text',
      Code: 'POST_FAQ1',
      Id: 'id1',
      Field: ContentFieldType.SHORT_TEXT,
      from: 'from',
      to: 'válor1',
    } as Record)
    expect(readLines[1]).toEqual({
      Model: 'text',
      Code: 'POST_FAQ1',
      Id: 'id1',
      Field: ContentFieldType.KEYWORDS,
      from: 'from',
      to: 'kw1;hola,amigo',
    } as Record)
    expect(readLines[2]).toEqual({
      Model: 'carousel',
      Code: 'POST_FAQ2',
      Id: 'id2',
      Field: ContentFieldType.TEXT,
      from: 'from',
      to: 'válor2',
    } as Record)
  }, 10000)

  test('TEST: StringFieldImporter test', async () => {
    // using manual mock because mockito was not recognizing the call. maybe because method returns Promise to void?
    class MockCms implements ManageCms {
      numCalls = 0

      copyField<T extends cms.Content>(
        context: ManageContext,
        contentId: cms.ContentId,
        field: ContentFieldType,
        fromLocale: string
      ): Promise<void> {
        fail("sholdn't be called")
      }

      updateField<T extends cms.Content>(
        context: ManageContext,
        contentId: ContentId,
        fieldType: ContentFieldType,
        value: any
      ): Promise<void> {
        this.numCalls++
        expect(context).toEqual(ctxt({ locale: SPANISH }))
        expect(contentId).toEqual(
          new cms.ContentId(cms.ContentType.TEXT, TEST_CSV_IMPORT_ID)
        )
        expect(fieldType).toEqual(ContentFieldType.KEYWORDS)
        expect(value).toEqual(['kw1', 'hola, amigo'])
        return Promise.resolve()
      }
    }

    const mock = new MockCms()
    const sut = new StringFieldImporter(mock, ctxt({ locale: SPANISH }))
    await sut.consume({
      Model: 'text',
      Code: 'POST_FAQ1',
      Id: TEST_CSV_IMPORT_ID,
      Field: ContentFieldType.KEYWORDS,
      from: 'from',
      to: ' kw1;hola, amigo ',
    } as Record)

    expect(mock.numCalls).toEqual(1)
  }, 10000)

  test('TEST: StringFieldImporter integration test', async () => {
    const manageCms = testManageContentful()
    try {
      const sut = new StringFieldImporter(manageCms, ctxt({ locale: SPANISH }))
      await sut.consume({
        Model: 'text',
        Code: 'POST_FAQ1',
        Id: TEST_CSV_IMPORT_ID,
        Field: ContentFieldType.KEYWORDS,
        from: 'from',
        to: 'kw1; kw2 ',
      } as Record)
      expect(
        (await testContentful().text(TEST_CSV_IMPORT_ID, { locale: SPANISH }))
          .common.keywords
      ).toEqual(['kw1', 'kw2'])
    } finally {
      console.log('restoring')
      await manageCms.updateField(
        ctxt({
          locale: SPANISH,
          allowOverwrites: true,
        }),
        new cms.ContentId(cms.ContentType.TEXT, TEST_CSV_IMPORT_ID),
        ContentFieldType.KEYWORDS,
        undefined
      )
    }
  }, 10000)
})
