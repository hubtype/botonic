import { testDirectus, testContext } from '../helpers/directus'

const BUTTON_TEXT_TARGET = 'f5cc71dd-0393-46c7-b0a4-834ca9d813e7'
const BUTTON_PAYLOAD_TARGET = '92f17fbe-784e-433b-b328-82e5e89da84d'
const BUTTON_IMAGE_TARGET = '397e92d4-3c44-4f2c-9743-a9d7c0bc72e3'

test('Test: directus button with Text target', async () => {
  const directus = testDirectus()
  const testButton = await directus.button(BUTTON_TEXT_TARGET, testContext())
  expect(testButton.common.name).toEqual('TEST_BUTTON_2')
  expect(testButton.text).toEqual('buttonText2')
  expect(testButton.target).toEqual('text$a3b990d2-0f03-4b9a-996d-05316ac2352a')
})

test('Test: directus button with payload target', async () => {
  const directus = testDirectus()
  const testButton = await directus.button(BUTTON_PAYLOAD_TARGET, testContext())
  expect(testButton.target).toEqual('payloadddd')
})

test('Test: directus button with image target', async () => {
  const directus = testDirectus()
  const testButton = await directus.button(BUTTON_IMAGE_TARGET, testContext())
  expect(testButton.target).toEqual(
    'image$7fc52bdc-4013-4872-b143-a1e715ee8901'
  )
})
