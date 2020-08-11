import { testManageContentful } from './manage-contentful.helper'
import { TEST_DEFAULT_LOCALE, testContentful } from '../contentful.helper'
import { rndStr } from '../../../src/cms/test-helpers'
import * as cms from '../../../src/cms/'
import { CmsException } from '../../../src/cms/'
import { ENGLISH, SPANISH } from '../../../src/nlp'
import { ContentFieldType } from '../../../src/manage-cms/fields'
import { ManageContext } from '../../../src/manage-cms/manage-context'
import { repeatWithBackoff } from '../../../src/util/backoff'

function ctxt(ctx: Partial<ManageContext>): ManageContext {
  return { ...ctx, preview: false } as ManageContext
}

// Since the tests modify contentful contents, they might fail if executed
// more than once simultaneously (eg from 2 different branches from CI)
describe('ManageContentful fields', () => {
  const TEST_MANAGE_CMS_ID = '627QkyJrFo3grJryj0vu6L'

  test('TEST: updateField on an empty field', async () => {
    const contentful = testContentful({ disableCache: true })
    const old = await contentful.text(
      TEST_MANAGE_CMS_ID,
      ctxt({ locale: SPANISH })
    )
    const sut = testManageContentful()

    const newValue = rndStr()
    try {
      if (old.text) {
        throw new CmsException(
          `Text field from text ${TEST_MANAGE_CMS_ID} should be blank but is '${old.text}'.
        The test will fail and remove its value`
        )
      }
      // ACT
      await sut.updateField(
        ctxt({ locale: SPANISH }),
        old.contentId,
        ContentFieldType.TEXT,
        newValue
      )
      await repeatWithBackoff(async () => {
        const newContent = await contentful.text(old.id, {
          locale: SPANISH,
        })
        expect(newContent).toEqual(old.cloneWithText(newValue))
      })
    } finally {
      // RESTORE
      await sut.updateField(
        ctxt({ locale: SPANISH, allowOverwrites: true }),
        old.contentId,
        ContentFieldType.TEXT,
        ''
      )
      await repeatWithBackoff(async () => {
        const restored = await contentful.text(old.id, {
          locale: SPANISH,
        })
        expect(restored).toEqual(old)
      })
    }
  }, 40000)

  test('TEST: updateField by default does not allow overwrites', async () => {
    const sut = testManageContentful()

    try {
      expect.assertions(3)
      await sut.updateField(
        ctxt({ locale: TEST_DEFAULT_LOCALE }),
        new cms.ContentId(cms.ContentType.BUTTON, TEST_MANAGE_CMS_ID),
        ContentFieldType.TEXT,
        rndStr()
      )
    } catch (e) {
      // eslint-disable-next-line jest/no-try-expect
      expect(e).toBeInstanceOf(CmsException)
      if (e instanceof CmsException) {
        // eslint-disable-next-line jest/no-try-expect
        expect(e.message).toInclude(
          "Error calling ManageCms.updateField on 'button' with id '627QkyJrFo3grJryj0vu6L'."
        )
        // eslint-disable-next-line jest/no-try-expect
        expect(e.reason.message).toInclude('Cannot overwrite')
      }
    }
  }, 40000)

  test('TEST: copyField buttons', async () => {
    const contentful = testContentful({ disableCache: true })
    const oldContent = await contentful.text(TEST_MANAGE_CMS_ID)
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
      await sut.updateField(
        ctxt({ locale: TO_LOCALE, allowOverwrites: true }),
        oldContent.contentId,
        ContentFieldType.BUTTONS,
        []
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
