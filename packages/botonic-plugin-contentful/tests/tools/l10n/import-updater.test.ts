import { anything, instance, mock, when } from 'ts-mockito'

import * as cms from '../../../src/cms'
import { AssetId, ContentId, ContentType } from '../../../src/cms'
import {
  ContentFieldType,
  ManageCms,
  ManageContext,
} from '../../../src/manage-cms'
import { ContentDeleter } from '../../../src/manage-cms/content-deleter'
import { FieldsValues } from '../../../src/manage-cms/manage-cms'
import { SPANISH } from '../../../src/nlp'
import {
  ContentToImport,
  ImportContentUpdater,
  ImportRecordReducer,
} from '../../../src/tools/l10n/import-updater'
import { repeatWithBackoff } from '../../../src/util/backoff'
import {
  testContentful,
  testContentfulInfo,
} from '../../contentful/contentful.helper'
import { testManageContentful } from '../../contentful/manage/manage-contentful.helper'

const TEST_CSV_IMPORT_ID = '3LOUB5Udmxw7rh87G5Ob9b'
function ctxt(ctx: Partial<ManageContext>): ManageContext {
  return { ...ctx, preview: false } as ManageContext
}

test('TEST: ImportRecordReducer test check updateFields calls', async () => {
  // using manual mock because mockito was not recognizing the call. maybe because method returns Promise to void?
  let numCalls = 0
  const record = {
    Model: ContentType.TEXT,
    Code: 'POST_FAQ1',
    Id: TEST_CSV_IMPORT_ID,
    Field: ContentFieldType.KEYWORDS,
    from: 'kw1;hello, my friend',
    to: ' kw1;hola, amigo ',
  }

  const contentUpdater = mock(ImportContentUpdater)
  when(contentUpdater.update(anything())).thenCall(
    (content: ContentToImport) => {
      numCalls++
      expect(content.contentId).toEqual(
        ContentId.create(record.Model, record.Id)
      )
      expect(content.name).toEqual(record.Code)
      expect(content.fields).toEqual({
        [ContentFieldType.TEXT]: 'new text',
        [ContentFieldType.KEYWORDS]: ['kw1', 'hola, amigo'],
      })
      return Promise.resolve()
    }
  )
  const sut = new ImportRecordReducer(instance(contentUpdater), {})
  await sut.consume({ ...record })

  record.Field = ContentFieldType.TEXT
  record.to = 'new text'
  await sut.consume({ ...record })
  expect(numCalls).toEqual(0)
  await sut.flush()

  expect(numCalls).toEqual(1)
})

// Since the test modifies contentful contents, it might fail if executed
// more than once simultaneously (eg from 2 different branches from CI)
test('TEST: ImportRecordReducer integration test', async () => {
  const manageCms = testManageContentful()
  const contentful = testContentful()
  try {
    const updater = new ImportContentUpdater(
      manageCms,
      contentful,
      testContentfulInfo(),
      ctxt({ locale: SPANISH }),
      instance(mock(ContentDeleter))
    )
    const sut = new ImportRecordReducer(updater, {})
    await sut.consume({
      Model: 'text' as ContentType,
      Code: 'POST_FAQ1',
      Id: TEST_CSV_IMPORT_ID,
      Field: ContentFieldType.KEYWORDS,
      from: 'from',
      to: 'kw1; kw2 ',
    })
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

test('TEST: ContentUpdater', async () => {
  const contentId = new cms.ContentId(cms.ContentType.TEXT, TEST_CSV_IMPORT_ID)
  class MockCms implements ManageCms {
    copyAssetFile(
      context: ManageContext,
      assetId: AssetId,
      fromLocale: string
    ): Promise<void> {
      fail("shouldn't be called")
    }
    removeAssetFile(context: ManageContext, assetId: AssetId): Promise<void> {
      fail("shouldn't be called")
    }
    numCalls = 0

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
      fields: FieldsValues
    ): Promise<FieldsValues> {
      this.numCalls++
      expect(context).toEqual(ctxt({ locale: SPANISH }))
      expect(contentId).toEqual(contentId)
      expect(fields).toEqual({
        [ContentFieldType.TEXT]: 'new text',
        [ContentFieldType.KEYWORDS]: ['kw1', 'hola, amigo'],
      })
      return Promise.resolve(fields)
    }
  }
  const mockCms = new MockCms()
  const sut = new ImportContentUpdater(
    mockCms,
    testContentful(),
    testContentfulInfo(),
    ctxt({ locale: SPANISH }),
    instance(mock(ContentDeleter))
  )
  await sut.update(
    new ContentToImport(contentId, 'CONTENT_NAME', {
      [ContentFieldType.TEXT]: 'new text',
      [ContentFieldType.KEYWORDS]: ['kw1', 'hola, amigo'],
    })
  )
})
