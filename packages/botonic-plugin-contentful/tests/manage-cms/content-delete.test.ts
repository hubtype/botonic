import { ContentCallback, ContentType, TopContentId } from '../../src/cms'
import { MessageContentInverseTraverser } from '../../src/cms/visitors/message-visitors'
import { ContentFieldType, ManageContext } from '../../src/manage-cms'
import { ContentDeleter } from '../../src/manage-cms/content-deleter'
import { getFieldsForContentType } from '../../src/manage-cms/fields'
import { ENGLISH, SPANISH } from '../../src/nlp'
import { repeatWithBackoff } from '../../src/util/backoff'
import { testContentful } from '../contentful/contentful.helper'
import { testManageContentful } from '../contentful/manage/manage-contentful.helper'

const TEST_DELETER_ID = '1gYR6JNTdBpHBFVDhpQjyD'
const TEST_DELETER_SOURCE_ID = '7jgIsjPRD3fHzEYZbpaewT'

test('interactive ContentDeleter', async () => {
  const contentful = testContentful({ disableCache: true })
  const manage = testManageContentful()
  const context = {
    locale: SPANISH,
    preview: false,
    allowOverwrites: true,
    ignoreFallbackLocale: true,
  } as ManageContext
  const targetId = new TopContentId(ContentType.TEXT, TEST_DELETER_ID)
  const sourceId = new TopContentId(ContentType.TEXT, TEST_DELETER_SOURCE_ID)
  const traverser = new MessageContentInverseTraverser(contentful, context)

  console.log('Copying from English to Spanish')
  await manage.copyField(
    context,
    sourceId,
    ContentFieldType.BUTTONS,
    ENGLISH,
    false
  )
  for (const field of getFieldsForContentType(targetId.model)) {
    await manage.copyField(context, targetId, field, ENGLISH, false)
  }

  await repeatWithBackoff(async () => {
    console.log('Checking that initial contents are available')
    const sourceBefore = await contentful.text(TEST_DELETER_SOURCE_ID, context)
    expect(sourceBefore.buttons.map(b => b.callback)).toContainEqual(
      new ContentCallback(ContentType.TEXT, TEST_DELETER_ID)
    )

    const targetBefore = await contentful.text(targetId.id, context)
    expect(targetBefore.common.shortText).not.toBeEmpty()
    expect(targetBefore.common.keywords).not.toBeEmpty()
    expect(targetBefore.text).not.toBeEmpty()
    expect(targetBefore.buttons).not.toBeEmpty()
  })

  // act
  const sut = new ContentDeleter(manage, traverser, context)
  await sut.deleteContent(targetId)

  //assert
  await repeatWithBackoff(async () => {
    console.log('Checking that updated contents are available')
    const targetAfter = await contentful.text(targetId.id, context)
    expect(targetAfter.common.shortText).toBeEmpty()
    expect(targetAfter.common.keywords).toBeEmpty()
    expect(targetAfter.text).toBeEmpty()
    expect(targetAfter.buttons).toBeEmpty()

    const sourceAfter = await contentful.text(TEST_DELETER_SOURCE_ID, context)
    expect(sourceAfter.buttons.map(b => b.callback)).not.toContainEqual(
      new ContentCallback(ContentType.TEXT, TEST_DELETER_ID)
    )
  })
}, 900000)
