import { testDirectus, testContext } from '../helpers/directus.helper'
import { Text, Image, ButtonStyle } from '../../../src/cms'

const TEXT_WITHOUT_B_WITHOUT_F = '4873aa47-f797-43c0-afbf-86700f52c9f6'
const TEXT_WITH_2B_WITHOUT_F = 'e808f179-cbae-4d2b-81ea-178018e9801c'
const TEXT_WITHOUT_B_WITH_F_T = '8cc141f9-c600-408d-9d07-6b6c075657e0'
const TEXT_WITHOUT_B_WITH_F_I = '6d85f523-7d47-4227-a58c-b68ffcd47b92'
const TEXT_WITH_B_WITH_F_T_WITH_F_T = '8cc141f9-c600-408d-9d07-6b6c075657e0'
const TEXT_WITH_CUSTOM_FIELD = '96b15a4f-e0ac-444e-8784-e74f11969f00'
const TEXT_WITH_B_TYPE_TEXT = '62616d02-3537-4a0d-9e60-d4fd37f04b52'
const TEXT_BUTTONS_W_BUTTONSTYLE_QR = 'ce7c06b7-8817-4fa7-b0a5-1b1b84cd3da6'

test('Test: directus text without buttons without followup', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITHOUT_B_WITHOUT_F, testContext())
  expect(testText.buttons).toEqual([])
  expect(testText.common.name).toEqual('z_TEST_TEXT_WITHOUT_B_WITHOUT_F')
  expect(testText.text).toEqual(
    'directus text without buttons and without followup'
  )
})

test('Test: directus text with buttons (with target payload and text) and without followup', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITH_2B_WITHOUT_F, testContext())
  expect(testText.buttons![0].text).toEqual('buttonText')
  expect(testText.buttons![0].callback.payload).toEqual('payloadFromDirectus')
  expect(testText.buttons![1].text).toEqual('buttonText2')
  expect(testText.buttons![1].callback.payload).toEqual(
    'text$7b9cb226-a82c-46bc-8f82-e2d233a77de3'
  )
})

test('Test: directus text without buttons with text followup', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITHOUT_B_WITH_F_T, testContext())
  const followup = testText.common.followUp as Text
  expect(followup).toBeInstanceOf(Text)
  expect(followup.common.name).toEqual('TEST_FOLLOWUP_TEXT')
  expect(followup.text).toEqual("Hey, I'm a followup!")
})

test('Test: directus text without buttons image followup', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITHOUT_B_WITH_F_I, testContext())
  const followup = testText.common.followUp as Image
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
  const followup1 = testText.common.followUp as Text
  expect(followup1).toBeInstanceOf(Text)
  expect(followup1.common.name).toEqual('TEST_FOLLOWUP_TEXT')

  const followup2 = followup1.common.followUp as Text
  expect(followup2).toBeInstanceOf(Text)
  expect(followup2.common.name).toEqual('TEST_FOLLOWUP_OF_FOLLOWUP')
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
  expect(testText.buttons![0].callback.payload).toEqual(
    'text$68123386-d046-411d-9e0c-9e9d6bc08c05'
  )
})

test('Test: directus text with button of type text without shorText', async () => {
  const directus = testDirectus()
  const testText = await directus.text(TEXT_WITH_B_TYPE_TEXT, testContext())
  expect(testText.buttons![1].text).toEqual('z_TEST_TEXT_WITHOUT_SHORTTEXT')
})

test('Test: directus text with buttons of type quick replies', async () => {
  const directus = testDirectus()
  const testText = await directus.text(
    TEXT_BUTTONS_W_BUTTONSTYLE_QR,
    testContext()
  )
  expect(testText.buttonsStyle!).toEqual(ButtonStyle.QUICK_REPLY)
})
