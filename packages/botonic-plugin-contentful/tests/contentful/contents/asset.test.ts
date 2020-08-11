import { testContentful } from '../contentful.helper'
import { expectImgUrlIs } from './image.test'

export const TEST_ASSET_ID = '1T0ntgNJnDUSwz59zGMZO6'

test('TEST: contentful asset', async () => {
  const sut = testContentful()

  const asset = await sut.asset(TEST_ASSET_ID)

  expectImgUrlIs(asset.url, 'red.jpg')
  expect(asset.type).toEqual('image/jpeg')
  expect(asset.id).toEqual(TEST_ASSET_ID)
  expect(asset.details.size).toEqual(2253)
})

test('TEST: contentful assets', async () => {
  const sut = testContentful()

  const assets = await sut.assets()
  expect(assets.length).toBeGreaterThanOrEqual(3)
  expect(assets.map(a => a.id)).toContain(TEST_ASSET_ID)
})
