import {
  ButtonStyle,
  CmsException,
  ContentType,
  TopContentId,
} from '../../../src/cms/'
import { rndStr } from '../../../src/cms/test-helpers'
import { ContentFieldType } from '../../../src/manage-cms/fields'
import { ENGLISH } from '../../../src/nlp'
import { repeatWithBackoff } from '../../../src/util/backoff'
import { testContentful } from '../contentful.helper'
import {
  ctxt,
  MANAGE_CONTENTFUL_ENV,
  testManageContentful,
} from './manage-contentful.helper'

describe('ManageContentful entries', () => {
  const context = ctxt({ locale: ENGLISH })
  test('TEST: createContent and deleteContent', async () => {
    const contentful = testContentful({
      disableCache: true,
      disableFallbackCache: true,
      environment: MANAGE_CONTENTFUL_ENV,
    })
    const sut = testManageContentful({ environment: MANAGE_CONTENTFUL_ENV })
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
    const sut = testManageContentful({ environment: MANAGE_CONTENTFUL_ENV })
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
    const sut = testManageContentful({ environment: MANAGE_CONTENTFUL_ENV })
    const id = rndStr()
    const TEST_NEW_CONTENT_ID = new TopContentId(ContentType.TEXT, id)
    // ACT
    await expect(
      sut.deleteContent(context, TEST_NEW_CONTENT_ID)
    ).rejects.toThrow(CmsException)
  })

  test('TEST: updateFields is able to manage fields of type ButtonStyle and FollowUps', async () => {
    const sut = testManageContentful({ environment: MANAGE_CONTENTFUL_ENV })
    const contentful = testContentful({
      disableCache: true,
      disableFallbackCache: true,
      environment: MANAGE_CONTENTFUL_ENV,
    })
    const NEW_CONTENT = new TopContentId(ContentType.TEXT, rndStr())
    const FOLLOW_UP_CONTENT = new TopContentId(ContentType.TEXT, rndStr())
    const name = rndStr()
    const text = rndStr()
    const followUpName = rndStr()
    try {
      // ACT
      await sut.createContent(context, NEW_CONTENT.model, NEW_CONTENT.id)
      await sut.createContent(
        context,
        FOLLOW_UP_CONTENT.model,
        FOLLOW_UP_CONTENT.id
      )
      await sut.updateFields(context, NEW_CONTENT, {
        [ContentFieldType.NAME]: name,
        [ContentFieldType.TEXT]: text,
        [ContentFieldType.BUTTONS_STYLE]: ButtonStyle.QUICK_REPLY,
        [ContentFieldType.FOLLOW_UP]: FOLLOW_UP_CONTENT.id,
      })
      await sut.updateFields(context, FOLLOW_UP_CONTENT, {
        [ContentFieldType.NAME]: followUpName,
        [ContentFieldType.TEXT]: rndStr(),
      })
      await repeatWithBackoff(async () => {
        const result = await contentful.text(NEW_CONTENT.id)
        expect(result.name).toEqual(name)
        expect(result.text).toEqual(text)
        expect(result.buttonsStyle).toEqual(1)
        expect(result.common.followUp?.name).toEqual(followUpName)
      })
    } finally {
      // RESTORE
      await sut.deleteContent(context, NEW_CONTENT)
      await sut.deleteContent(context, FOLLOW_UP_CONTENT)
    }
  })

  test('TEST: updateFields is able to manage fields of type Handoff Queue, onFinish and Messages', async () => {
    const sut = testManageContentful({ environment: MANAGE_CONTENTFUL_ENV })
    const contentful = testContentful({
      disableCache: true,
      disableFallbackCache: true,
      environment: MANAGE_CONTENTFUL_ENV,
    })
    const NEW_CONTENT = new TopContentId(ContentType.HANDOFF, rndStr())
    const ON_FINISH_CONTENT = new TopContentId(ContentType.TEXT, rndStr())
    const NEW_QUEUE = new TopContentId(ContentType.QUEUE, rndStr())
    const name = rndStr()
    const message = rndStr()
    const failMessage = rndStr()
    const queueName = rndStr()
    const queue = rndStr()

    try {
      // ACT
      await sut.createContent(context, NEW_CONTENT.model, NEW_CONTENT.id)
      await sut.createContent(
        context,
        ON_FINISH_CONTENT.model,
        ON_FINISH_CONTENT.id
      )
      await sut.createContent(context, NEW_QUEUE.model, NEW_QUEUE.id)
      await sut.updateFields(context, NEW_CONTENT, {
        [ContentFieldType.NAME]: name,
        [ContentFieldType.MESSAGE]: message,
        [ContentFieldType.FAIL_MESSAGE]: failMessage,
        [ContentFieldType.ON_FINISH]: ON_FINISH_CONTENT.id,
        [ContentFieldType.HANDOFF_QUEUE]: NEW_QUEUE.id,
      })
      await sut.updateFields(context, ON_FINISH_CONTENT, {
        [ContentFieldType.NAME]: rndStr(),
        [ContentFieldType.TEXT]: rndStr(),
      })
      await sut.updateFields(context, NEW_QUEUE, {
        [ContentFieldType.NAME]: queueName,
        [ContentFieldType.SHORT_TEXT]: queueName,
        [ContentFieldType.QUEUE]: queue,
      })
      await repeatWithBackoff(async () => {
        const result = await contentful.handoff(NEW_CONTENT.id)
        expect(result.name).toEqual(name)
        expect(result.message).toEqual(message)
        expect(result.failMessage).toEqual(failMessage)
        expect(result.shadowing).toEqual(false)
        expect(result.queue?.name).toEqual(queueName)
        expect(result.queue?.queue).toEqual(queue)
        expect(result.onFinish.asContentId()?.id).toEqual(ON_FINISH_CONTENT.id)
      })
    } finally {
      // RESTORE
      await sut.deleteContent(context, NEW_CONTENT)
      await sut.deleteContent(context, ON_FINISH_CONTENT)
      await sut.deleteContent(context, NEW_QUEUE)
    }
  })
})
