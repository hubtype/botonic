import { CmsException, ContentType, TopContentId } from '../../../src/cms/'
import { rndStr } from '../../../src/cms/test-helpers'
import { ContentFieldType } from '../../../src/manage-cms/fields'
import { ENGLISH } from '../../../src/nlp'
import { repeatWithBackoff } from '../../../src/util/backoff'
import { testContentful } from '../contentful.helper'
import { ctxt, testManageContentful } from './manage-contentful.helper'

describe('ManageContentful entries', () => {
  const context = ctxt({ locale: ENGLISH })
  test('TEST: createContent and deleteContent', async () => {
    const contentful = testContentful({ disableCache: true })
    const sut = testManageContentful()
    const id = rndStr()
    const TEST_NEW_CONTENT_ID = new TopContentId(ContentType.TEXT, id)
    try {
      // ACT
      await sut.createContent(
        context,
        TEST_NEW_CONTENT_ID.model,
        TEST_NEW_CONTENT_ID.id
      )
      await sut.updateFields(context, TEST_NEW_CONTENT_ID, {
        [ContentFieldType.NAME]: rndStr(),
        [ContentFieldType.TEXT]: rndStr(),
      })
      await repeatWithBackoff(async () => {
        const newContent = await contentful.text(
          TEST_NEW_CONTENT_ID.id,
          context
        )
        expect(newContent.id).toEqual(TEST_NEW_CONTENT_ID.id)
      })
    } finally {
      // RESTORE / ACT
      await sut.deleteContent(context, TEST_NEW_CONTENT_ID)
      await repeatWithBackoff(async () => {
        await expect(
          contentful.text(TEST_NEW_CONTENT_ID.id, context)
        ).rejects.toThrow(CmsException)
      })
    }
  })

  test('TEST: createContent fails if the content already exists', async () => {
    const sut = testManageContentful()
    const id = rndStr()
    const TEST_NEW_CONTENT_ID = new TopContentId(ContentType.TEXT, id)
    try {
      // ACT
      await sut.createContent(
        context,
        TEST_NEW_CONTENT_ID.model,
        TEST_NEW_CONTENT_ID.id
      )
      await expect(
        sut.createContent(
          context,
          TEST_NEW_CONTENT_ID.model,
          TEST_NEW_CONTENT_ID.id
        )
      ).rejects.toThrow(CmsException)
    } finally {
      // RESTORE
      await sut.deleteContent(context, TEST_NEW_CONTENT_ID)
    }
  })

  test('TEST: deleteContent fails if the content does not exists', async () => {
    const sut = testManageContentful()
    const id = rndStr()
    const TEST_NEW_CONTENT_ID = new TopContentId(ContentType.TEXT, id)
    // ACT
    await expect(
      sut.deleteContent(context, TEST_NEW_CONTENT_ID)
    ).rejects.toThrow(CmsException)
  })
})
