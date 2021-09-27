import { testDirectus, testContext } from '../helpers/directus'
import { Text, Image, SupportedLocales as sl } from '../../../src/cms'

const TEXT_WITHOUT_B_WITHOUT_F = 'a3b990d2-0f03-4b9a-996d-05316ac2352a'
const TEXT_WITH_2B_WITHOUT_F = 'f8a7cc7d-11f3-4893-a6ec-5eb8152d654f'
const TEXT_WITHOUT_B_WITH_F_T = '11d4756a-085c-4256-8edb-3e9db2472aeb'
const TEXT_WITHOUT_B_WITH_F_I = '630dbe23-10c6-4fb4-b71c-f4b734c6ac6a'
const TEXT_WITH_B_WITH_F_T_WITH_F_T = 'c9e56d03-9c18-4c97-ac6b-67fb0f38080d'
const TEXT_WITH_CUSTOM_FIELD = 'b52a16f9-1aed-4d71-bfb2-445399bdca2d'
const TEXT_WITH_B_TYPE_TEXT = '3f622db8-6206-4e4d-ac82-6bf508414941'
const TEXT_WITH_THREE_LOCALES = '132573f0-33f7-48f3-98fb-e5ec362ebb48'

test('Test: directus text without buttons without followup', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITHOUT_B_WITHOUT_F, testContext())
  expect(testText.buttons).toBeUndefined
  expect(testText.common.name).toEqual('z_TEST_TEXT_WITHOUT_B_WITHOUT_F')
  expect(testText.text).toEqual(
    'directus text without buttons and without followup'
  )
})

test('Test: directus text with buttons (with target payload and text) and without followup', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITH_2B_WITHOUT_F, testContext())
  expect(testText.buttons![0].text).toEqual('buttonText')
  expect(testText.buttons![0].target).toEqual('payloadFromDirectus')
  expect(testText.buttons![1].text).toEqual('buttonText2')
  expect(testText.buttons![1].target).toEqual(
    'text$a3b990d2-0f03-4b9a-996d-05316ac2352a'
  )
})

test('Test: directus text without buttons with text followup', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITHOUT_B_WITH_F_T, testContext())
  const followup = testText.common.followup as Text
  expect(followup).toBeInstanceOf(Text)
  expect(followup.common.name).toEqual('TEST_FOLLOWUP_TEXT')
  expect(followup.text).toEqual("Hey, I'm a followup!")
})

test('Test: directus text without buttons image followup', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITHOUT_B_WITH_F_I, testContext())
  const followup = testText.common.followup as Image
  expect(followup).toBeInstanceOf(Image)
  expect(followup.common.name).toEqual('TEST_FOLLOWUP_IMAGE')
})

test('Test: directus text with buttons with text followup with text followup', async () => {
  const directus = testDirectus()
  const testText = await directus.text(
    TEXT_WITH_B_WITH_F_T_WITH_F_T,
    testContext()
  )
  expect(testText.buttons).toHaveLength(3)
  const followup1 = testText.common.followup as Text
  expect(followup1).toBeInstanceOf(Text)
  expect(followup1.common.name).toEqual('TEST_BASKETBALL')

  const followup2 = followup1.common.followup as Text
  expect(followup2).toBeInstanceOf(Text)
  expect(followup2.common.name).toEqual('TEST_FOOTBALL')
  expect(followup2.buttons).toHaveLength(1)
})

test('Test: directus text with custom field', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITH_CUSTOM_FIELD, testContext())
  expect(testText.common.customFields!.customfieldtext).toEqual(
    'Hi, this is a custom field text!'
  )
})

test('Test: directus text with button of type text', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITH_B_TYPE_TEXT, testContext())
  expect(testText.buttons![0].text).toEqual('This will be the button text')
  expect(testText.buttons![0].target).toEqual(
    'text$32cb73fa-3ee9-4a56-9fe8-fd2e95b5525a'
  )
})

test('Test: directus text with button of type text without shorText', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITH_B_TYPE_TEXT, testContext())
  expect(testText.buttons![1].text).toEqual('z_TEST_TEXT_WITHOUT_SHORTTEXT')
})

const TEXT_TEXT_PER_LOCALE: Record<sl, string> = {
  [sl.SPANISH]: 'Esto es un texto en español',
  [sl.ENGLISH]: 'This is a text written in english',
  [sl.ITALIAN]: 'Questo è un testo scritto in italiano',
}

const BUTTON_TEXT_PER_LOCALE: Record<sl, string> = {
  [sl.SPANISH]: 'Botón en español',
  [sl.ENGLISH]: 'Button text in english',
  [sl.ITALIAN]: 'Pulsante in italiano',
}

const FOLLOWUP_TEXT_PER_LOCALE: Record<sl, string> = {
  [sl.SPANISH]: 'Texto de followup en español',
  [sl.ENGLISH]: 'Followup text in english',
  [sl.ITALIAN]: 'Testo di follow-up in italiano',
}

test.each([[sl.SPANISH], [sl.ITALIAN], [sl.ENGLISH]])(
  'Test:directus text with different locales',
  async lang => {
    const directus = testDirectus()
    const testText = await directus.text(TEXT_WITH_THREE_LOCALES, lang)
    expect(testText.text).toEqual(TEXT_TEXT_PER_LOCALE[lang])
    expect(testText.buttons![0].text).toEqual(BUTTON_TEXT_PER_LOCALE[lang])
    expect((testText.common.followup as Text).text).toEqual(
      FOLLOWUP_TEXT_PER_LOCALE[lang]
    )
  }
)
