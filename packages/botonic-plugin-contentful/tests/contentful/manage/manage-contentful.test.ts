import { testManageContentful } from './manage-contentful.helper'
import { TEST_DEFAULT_LOCALE, testContentful } from '../contentful.helper'
import { rndStr } from '../../../src/cms/test-helpers'
import * as cms from '../../../src/cms/'
import { CmsException } from '../../../src/cms/'
import { ENGLISH, SPANISH } from '../../../src/nlp'
import { ContentFieldType } from '../../../src/manage-cms/fields'
import { ManageContext } from '../../../src/manage-cms/manage-context'

function ctxt(ctx: Partial<ManageContext>): ManageContext {
  return { ...ctx, preview: false } as ManageContext
}

// Using ManageContentful to ensure that tests are run sequentially to avoid race
// since they modify the same content
describe('ManageContentful', () => {
  const TEST_MANAGE_CMS_ID = '627QkyJrFo3grJryj0vu6L'

  test('TEST: updateField on an empty field', async () => {
    console.log('ManageContentful1 start')
    const cms = testContentful({ disableCache: true })
    const old = await cms.text(TEST_MANAGE_CMS_ID, ctxt({ locale: SPANISH }))
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
      await sut.updateField<cms.Text>(
        ctxt({ locale: SPANISH }),
        old.contentId,
        ContentFieldType.TEXT,
        newValue
      )
      const newContent = await cms.text(old.id, {
        locale: SPANISH,
      })
      expect(newContent).toEqual(old.cloneWithText(newValue))
    } finally {
      console.log('restoring')
      // RESTORE
      await sut.updateField<cms.Text>(
        ctxt({ locale: SPANISH, allowOverwrites: true }),
        old.contentId,
        ContentFieldType.TEXT,
        ''
      )
      const restored = await cms.text(old.id, {
        locale: SPANISH,
      })
      expect(restored).toEqual(old)
    }
    console.log('ManageContentful1 end')
  })

  test('TEST: updateField by default does not allow overwrites', async () => {
    console.log('ManageContentful2 start')
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
        expect(e.message).toEqual(
          "Error calling ManageCms.updateField on 'button' with id '627QkyJrFo3grJryj0vu6L'."
        )
        // eslint-disable-next-line jest/no-try-expect
        expect(e.reason.message).toInclude('Cannot overwrite')
      }
    }
    console.log('ManageContentful2 end')
  })

  test('TEST: copyField buttons', async () => {
    console.log('ManageContentful3 start')
    const cms = testContentful({ disableCache: true })
    const oldContent = await cms.text(TEST_MANAGE_CMS_ID)
    const sut = testManageContentful()
    const FROM_LOCALE = ENGLISH
    const TO_LOCALE = SPANISH

    const fromButtons = (
      await cms.text(oldContent.id, {
        locale: FROM_LOCALE,
      })
    ).buttons
    expect(fromButtons.length).toBeGreaterThan(0)

    try {
      // ACT
      await sut.copyField<cms.Text>(
        ctxt({ locale: TO_LOCALE }),
        oldContent.contentId,
        ContentFieldType.BUTTONS,
        FROM_LOCALE
      )
      const newContent = await cms.text(oldContent.id, {
        locale: TO_LOCALE,
      })
      expect(newContent.buttons.length).toEqual(fromButtons.length)
    } finally {
      // RESTORE
      console.log('restoring')
      await sut.updateField<cms.Text>(
        ctxt({ locale: TO_LOCALE, allowOverwrites: true }),
        oldContent.contentId,
        ContentFieldType.BUTTONS,
        []
      )
      const restored = await cms.text(oldContent.id, {
        locale: TO_LOCALE,
        ignoreFallbackLocale: true,
      })
      expect(restored.buttons).toEqual([])
    }
    console.log('ManageContentful3 end')
  })
})
