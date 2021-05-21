import { Asset } from '../../../src/cms/contents'
import { testContentful } from '../contentful.helper'
import { expectImgUrlIs } from './image.test'

export const TEST_ASSET_ID = '1T0ntgNJnDUSwz59zGMZO6'

test('TEST: contentful asset', async () => {
  const sut = testContentful()

  const asset = await sut.asset(TEST_ASSET_ID)
  expectRedAsset(asset)
})

test('TEST: contentful assets', async () => {
  const sut = testContentful()

  const assets = await sut.assets()
  expect(assets.length).toBeGreaterThanOrEqual(3)
  expect(assets.map(a => a.id)).toContain(TEST_ASSET_ID)
  expectRedAsset(assets.filter(a => a.id == TEST_ASSET_ID)[0])
})

function expectRedAsset(asset: Asset) {
  expectImgUrlIs(asset.url, 'red.jpg')
  expect(asset.info.description).toEqual('red background')
  expect(asset.info.name).toEqual('red')
  expect(asset.info.type).toEqual('image/jpeg')
  expect(asset.info.fileName).toEqual('red.jpg')
  expect(asset.id).toEqual(TEST_ASSET_ID)
  expect(asset.details.size).toEqual(2253)
}
