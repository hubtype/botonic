import path from 'path'
import {
  CsvImport,
  Record,
  StringFieldImporter,
} from '../../../src/tools/l10n/csv-import'
import { anything, instance, mock, when } from 'ts-mockito'
import { testManageContentful } from '../../contentful/manage/manage-contentful.helper'
import { Locale, SPANISH } from '../../../src/nlp'
import * as cms from '../../../src/cms'
import { ContentId, ContentType } from '../../../src/cms'
import { testContentful } from '../../contentful/contentful.helper'
import { ManageCms } from '../../../src/manage-cms/manage-cms'
import { ContentFieldType } from '../../../src/manage-cms/fields'
import { ManageContext } from '../../../src/manage-cms/manage-context'
import { repeatWithBackoff } from '../../../src/util/backoff'

const TEST_CSV_IMPORT_ID = '3LOUB5Udmxw7rh87G5Ob9b'
const FIXTURES_BASE = path.resolve(__dirname, '__fixtures__')

function ctxt(ctx: Partial<ManageContext>): ManageContext {
  return { ...ctx, preview: false } as ManageContext
}

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

test('TEST: StringFieldImporter test check updateFields calls', async () => {
  // using manual mock because mockito was not recognizing the call. maybe because method returns Promise to void?
  class MockCms implements ManageCms {
    copyAssetFile(
      context: ManageContext,
      assetId: string,
      fromLocale: string
    ): Promise<void> {
      fail("shouldn't be called")
    }
    removeAssetFile(context: ManageContext, assetId: string): Promise<void> {
      fail("shouldn't be called")
    }
    numCalls = 0

    getDefaultLocale(): Promise<Locale> {
      fail("shouldn't be called")
    }

    copyField<T extends cms.Content>(
      context: ManageContext,
      contentId: cms.ContentId,
      field: ContentFieldType,
      fromLocale: string,
      onlyIfTargetEmpty: boolean
    ): Promise<void> {
      fail("shouldn't be called")
    }

    updateFields<T extends cms.Content>(
      context: ManageContext,
      contentId: ContentId,
      fields: { [contentFieldType: string]: any }
    ): Promise<void> {
      this.numCalls++
      expect(context).toEqual(ctxt({ locale: SPANISH }))
      expect(contentId).toEqual(
        new cms.ContentId(cms.ContentType.TEXT, TEST_CSV_IMPORT_ID)
      )
      expect(fields).toEqual({
        [ContentFieldType.TEXT]: 'new text',
        [ContentFieldType.KEYWORDS]: ['kw1', 'hola, amigo'],
      })
      return Promise.resolve()
    }
  }

  const mock = new MockCms()
  const sut = new StringFieldImporter(mock, ctxt({ locale: SPANISH }))
  const record = {
    Model: ContentType.TEXT,
    Code: 'POST_FAQ1',
    Id: TEST_CSV_IMPORT_ID,
    Field: ContentFieldType.KEYWORDS,
    from: 'from',
    to: ' kw1;hola, amigo ',
  }
  await sut.consume({ ...record })

  record.Field = ContentFieldType.TEXT
  record.to = 'new text'
  await sut.consume({ ...record })
  expect(mock.numCalls).toEqual(0)
  await sut.flush()

  expect(mock.numCalls).toEqual(1)
})

// Since the test modifies contentful contents, it might fail if executed
// more than once simultaneously (eg from 2 different branches from CI)
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
    await sut.flush()
    await repeatWithBackoff(async () => {
      expect(
        (await testContentful().text(TEST_CSV_IMPORT_ID, { locale: SPANISH }))
          .common.keywords
      ).toEqual(['kw1', 'kw2'])
    })
  } finally {
    await manageCms.updateFields(
      ctxt({
        locale: SPANISH,
        allowOverwrites: true,
      }),
      new cms.ContentId(cms.ContentType.TEXT, TEST_CSV_IMPORT_ID),
      { [ContentFieldType.KEYWORDS]: undefined }
    )
  }
}, 40000)
