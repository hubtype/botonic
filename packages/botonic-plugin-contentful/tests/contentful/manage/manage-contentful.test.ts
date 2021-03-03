import * as cms from '../../../src/cms/'
import { CmsException, TopContentId } from '../../../src/cms/'
import { rndStr } from '../../../src/cms/test-helpers'
import { ManageCms } from '../../../src/manage-cms'
import { ContentFieldType } from '../../../src/manage-cms/fields'
import { ManageContext } from '../../../src/manage-cms/manage-context'
import { ENGLISH, SPANISH } from '../../../src/nlp'
import { repeatWithBackoff } from '../../../src/util/backoff'
import { TEST_DEFAULT_LOCALE, testContentful } from '../contentful.helper'
import { testManageContentful } from './manage-contentful.helper'

function ctxt(ctx: Partial<ManageContext>): ManageContext {
  return { ...ctx, preview: false } as ManageContext
}

// Since the tests modify contentful contents, they might fail if executed
// more than once simultaneously (eg from 2 different branches from CI)
describe('ManageContentful fields', () => {
  const TEST_CONTENT_ID = new TopContentId(
    cms.ContentType.TEXT,
    '627QkyJrFo3grJryj0vu6L' //TEST_MANAGE_CMS
  )
  const RESTORE_TEXT_VALUE = undefined // so that it fallbacks to English
  const contentful = testContentful({ disableCache: true })
  // @ts-ignore
  let fallbackLocaleContent: cms.Text = undefined

  beforeAll(async () => {
    fallbackLocaleContent = await contentful.text(
      TEST_CONTENT_ID.id,
      ctxt({ locale: ENGLISH })
    )
  })

  test('TEST: updateFields with empty ("") value does not fallback', async () => {
    await updateEmptyField('', '')
  }, 400000)

  test('TEST: updateFields with undefined value falls back to other locale', async () => {
    await updateEmptyField(undefined, fallbackLocaleContent.text)
  }, 40000)

  test('TEST: updateFields non empty', async () => {
    const newValue = rndStr()
    await updateEmptyField(newValue, newValue)
  }, 40000)

  async function updateEmptyField(
    newValue: string | undefined,
    expectedValue: string
  ) {
    const contentful = testContentful({ disableCache: true })
    const oldTextValue = (
      await contentful.text(
        TEST_CONTENT_ID.id,
        ctxt({ locale: SPANISH, ignoreFallbackLocale: true })
      )
    ).text
    const oldSpanishContent = await contentful.text(
      TEST_CONTENT_ID.id,
      ctxt({ locale: SPANISH })
    )

    const sut = testManageContentful()

    try {
      if (oldTextValue) {
        throw new CmsException(
          `Text field from ${TEST_CONTENT_ID.toString()} should be blank but is '${oldTextValue}'.
        The test will fail and remove its value`
        )
      }
      // ACT
      await sut.updateFields(ctxt({ locale: SPANISH }), TEST_CONTENT_ID, {
        [ContentFieldType.TEXT]: newValue,
      })
      await repeatWithBackoff(async () => {
        const newContent = await contentful.text(TEST_CONTENT_ID.id, {
          locale: SPANISH,
        })
        const expected = oldSpanishContent.cloneWithText(expectedValue)
        expect(newContent).toEqual(expected)
      })
    } finally {
      await restoreValue(sut)
    }
  }

  async function restoreValue(manage: ManageCms) {
    await manage.updateFields(
      ctxt({ locale: SPANISH, allowOverwrites: true }),
      TEST_CONTENT_ID,
      { [ContentFieldType.TEXT]: RESTORE_TEXT_VALUE }
    )
    await repeatWithBackoff(async () => {
      const restored = await contentful.text(TEST_CONTENT_ID.id, {
        locale: SPANISH,
      })
      expect(restored.text).toEqual(fallbackLocaleContent.text)
    })
  }

  test('TEST: updateFields by default does not allow overwrites', async () => {
    const sut = testManageContentful()
    const newFields = { [ContentFieldType.TEXT]: rndStr() }

    try {
      expect.assertions(4)
      await sut.updateFields(
        ctxt({ locale: TEST_DEFAULT_LOCALE }),
        TEST_CONTENT_ID,
        newFields
      )
    } catch (e) {
      // eslint-disable-next-line jest/no-try-expect,jest/no-conditional-expect
      expect(e).toBeInstanceOf(CmsException)
      if (e instanceof CmsException) {
        // eslint-disable-next-line jest/no-try-expect,jest/no-conditional-expect
        expect(e.message).toInclude(
          "Error calling ManageCms.updateFields with locale 'en' on 'text' with id '627QkyJrFo3grJryj0vu6L' " +
            `with args '${JSON.stringify(newFields)}'. ` +
            "Due to: Cannot overwrite field 'text' of entry '627QkyJrFo3grJryj0vu6L'"
        )
        // eslint-disable-next-line jest/no-try-expect,jest/no-conditional-expect
        expect(e.message).toInclude(
          'because ManageContext.allowOverwrites is false'
        )

        // eslint-disable-next-line jest/no-try-expect,jest/no-conditional-expect
        expect(e.reason.message).toInclude('Cannot overwrite')
      }
    }
  }, 40000)

  test('TEST: copyField buttons', async () => {
    const contentful = testContentful({ disableCache: true })
    const oldContent = await contentful.text(TEST_CONTENT_ID.id)
    const sut = testManageContentful()
    const FROM_LOCALE = ENGLISH
    const TO_LOCALE = SPANISH

    const fromButtons = (
      await contentful.text(oldContent.id, {
        locale: FROM_LOCALE,
      })
    ).buttons
    expect(fromButtons.length).toBeGreaterThan(0)

    try {
      // ACT
      await sut.copyField(
        ctxt({ locale: TO_LOCALE }),
        oldContent.contentId,
        ContentFieldType.BUTTONS,
        FROM_LOCALE,
        false
      )
      // wait until CDNs provide the new value
      await repeatWithBackoff(async () => {
        const newContent = await contentful.text(oldContent.id, {
          locale: TO_LOCALE,
        })
        expect(newContent.buttons.length).toEqual(fromButtons.length)
      })
    } finally {
      // RESTORE
      await sut.updateFields(
        ctxt({ locale: TO_LOCALE, allowOverwrites: true }),
        oldContent.contentId,
        { [ContentFieldType.BUTTONS]: [] }
      )
      await repeatWithBackoff(async () => {
        const restored = await contentful.text(oldContent.id, {
          locale: TO_LOCALE,
          ignoreFallbackLocale: true,
        })
        expect(restored.buttons).toEqual([])
      })
    }
  }, 40000)
})
