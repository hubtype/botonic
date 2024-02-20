import { Stream } from 'stream'
import { anything, capture, instance, mock, when } from 'ts-mockito'

import * as cms from '../../../src/cms'
import { AssetId, AssetInfo, ContentId, ContentType } from '../../../src/cms'
import {
  ContentFieldType,
  ManageCms,
  ManageContext,
} from '../../../src/manage-cms'
import { ContentDeleter } from '../../../src/manage-cms/content-deleter'
import { FieldsValues } from '../../../src/manage-cms/manage-cms'
import { SPANISH } from '../../../src/nlp'
import { Record } from '../../../src/tools/l10n/csv-import'
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

test('TEST: ImportRecordReducer', async () => {
  const records: Record[] = [
    {
      Model: cms.ContentType.TEXT,
      Code: 'POST_FAQ1',
      Id: 'id1',
      Field: ContentFieldType.SHORT_TEXT,
      from: 'from',
      to: 'válor1',
    },
    {
      Model: cms.ContentType.TEXT,
      Code: 'POST_FAQ1',
      Id: 'id1',
      Field: ContentFieldType.KEYWORDS,
      from: 'from',
      to: 'kw1;hola,amigo',
    },
    {
      Model: cms.ContentType.CAROUSEL,
      Code: 'POST_FAQ2',
      Id: 'id2',
      Field: ContentFieldType.TEXT,
      from: 'from',
      to: 'válor2',
    },
  ]
  const mockUpdater = mock(ImportContentUpdater)

  const sut = new ImportRecordReducer(instance(mockUpdater), {})
  for (const record of records) {
    await sut.consume(record)
  }
  await sut.flush()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  expect(capture(mockUpdater.update).first()).toEqual([
    new ContentToImport(new ContentId(ContentType.TEXT, 'id1'), 'POST_FAQ1', {
      [ContentFieldType.SHORT_TEXT]: 'válor1',
      [ContentFieldType.KEYWORDS]: ['kw1', 'hola', 'amigo'],
    }),
  ])
  // eslint-disable-next-line @typescript-eslint/unbound-method
  expect(capture(mockUpdater.update).second()).toEqual([
    new ContentToImport(
      new ContentId(ContentType.CAROUSEL, 'id2'),
      'POST_FAQ2',
      {
        [ContentFieldType.TEXT]: 'válor2',
      }
    ),
  ])
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
      _context: ManageContext,
      _assetId: AssetId,
      _fromLocale: string
    ): Promise<void> {
      fail("shouldn't be called")
    }
    removeAssetFile(_context: ManageContext, _assetId: AssetId): Promise<void> {
      fail("shouldn't be called")
    }
    numCalls = 0

    copyField(
      _context: ManageContext,
      _contentId: cms.ContentId,
      _field: ContentFieldType,
      _fromLocale: string,
      _onlyIfTargetEmpty: boolean
    ): Promise<void> {
      fail("shouldn't be called")
    }

    updateFields(
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

    deleteContent(
      _context: ManageContext,
      _contentId: ContentId
    ): Promise<void> {
      fail("shouldn't be called")
    }

    createContent(
      _context: ManageContext,
      _model: ContentType,
      _id: string
    ): Promise<void> {
      fail("shouldn't be called")
    }

    createAsset(
      _context: ManageContext,
      _file: string | ArrayBuffer | Stream,
      _info: AssetInfo
    ): Promise<{ id: string; url?: string }> {
      fail("shouldn't be called")
    }

    removeAsset(_context: ManageContext, _assetId: AssetId): Promise<void> {
      fail("shouldn't be called")
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
