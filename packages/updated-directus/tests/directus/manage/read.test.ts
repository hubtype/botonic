import { Carousel, ContentType, Image, Text, Url } from '../../../src/cms'
import { testContext, testDirectus } from '../helpers/directus.helper'

test('Test: get all contents of type text', async () => {
  const directus = testDirectus()
  const textEntries = await directus.topContents(
    ContentType.TEXT,
    testContext()
  )
  textEntries.forEach(textEntry => {
    expect(textEntry).toBeInstanceOf(Text)
  })
})

test('Test: get all contents of type url', async () => {
  const directus = testDirectus()
  const urlEntries = await directus.topContents(ContentType.URL, testContext())
  urlEntries.forEach(urlEntry => {
    expect(urlEntry).toBeInstanceOf(Url)
  })
})

test('Test: get all contents of type carousel', async () => {
  const directus = testDirectus()
  const textEntries = await directus.topContents(
    ContentType.CAROUSEL,
    testContext()
  )
  textEntries.forEach(textEntry => {
    expect(textEntry).toBeInstanceOf(Carousel)
  })
})

test('Test: get all contents of type image', async () => {
  const directus = testDirectus()
  const imageEntries = await directus.topContents(
    ContentType.IMAGE,
    testContext()
  )
  imageEntries.forEach(imageEntry => {
    expect(imageEntry).toBeInstanceOf(Image)
  })
})
