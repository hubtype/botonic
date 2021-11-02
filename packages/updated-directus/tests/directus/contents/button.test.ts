import { testContext, testDirectus } from '../helpers/directus.helper'

const BUTTON_TEXT_TARGET = 'd467a152-a746-4ed0-9e6f-d83a6d0c3a5b'
const BUTTON_PAYLOAD_TARGET = '09f88f45-c717-449b-b979-51308e779744'
const BUTTON_IMAGE_TARGET = 'ff8b23c4-872f-4b81-bb6a-d30d4d044a7b'
const BUTTON_URL_TARGET = 'eefd1c61-0881-4bf7-b863-94e6bb1a52ed'
const BUTTON_CAROUSEL_TARGET = 'b4aca626-b988-40de-a26f-5bac3005b3c4'

test('Test: directus button with Text target', async () => {
  const directus = testDirectus()
  const testButton = await directus.button(BUTTON_TEXT_TARGET, testContext())
  expect(testButton.common.name).toEqual('TEST_BUTTON_2')
  expect(testButton.text).toEqual('buttonText2')
  expect(testButton.callback.payload).toEqual(
    'text$7b9cb226-a82c-46bc-8f82-e2d233a77de3'
  )
})

test('Test: directus button with payload target', async () => {
  const directus = testDirectus()
  const testButton = await directus.button(BUTTON_PAYLOAD_TARGET, testContext())
  expect(testButton.callback.payload).toEqual('payloadddd')
})

test('Test: directus button with image target', async () => {
  const directus = testDirectus()
  const testButton = await directus.button(BUTTON_IMAGE_TARGET, testContext())
  expect(testButton.callback.payload).toEqual(
    'image$f3753667-f745-4258-b20c-afad44c4939b'
  )
})

test('Test: directus button with url target', async () => {
  const directus = testDirectus()
  const testButton = await directus.button(BUTTON_URL_TARGET, testContext())
  expect(testButton.callback.url).toEqual('www.google.com')
})

test('Test: directus button with carousel target', async () => {
  const directus = testDirectus()
  const testButton = await directus.button(
    BUTTON_CAROUSEL_TARGET,
    testContext()
  )
  expect(testButton.callback.payload).toEqual(
    'carousel$3c2bfdb6-8e2f-43f8-9173-32956c11c48d'
  )
})
