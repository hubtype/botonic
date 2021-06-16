import { AssetId, CmsException } from '../../../src/cms/'
import { rndStr } from '../../../src/cms/test-helpers'
import { ENGLISH, SPANISH } from '../../../src/nlp'
import { repeatWithBackoff } from '../../../src/util/backoff'
import { testContentful } from '../contentful.helper'
import { TEST_ASSET_ID } from '../contents/asset.test'
import { ctxt, testManageContentful } from './manage-contentful.helper'

// Since the tests modify contentful contents, they might fail if executed
// more than once simultaneously (eg from 2 different branches from CI)
describe('ManageContentful assets', () => {
  test('TEST: copyAssetFile', async () => {
    const sut = testManageContentful()
    const id = new AssetId(TEST_ASSET_ID, undefined)
    try {
      // ACT
      await sut.copyAssetFile(ctxt({ locale: SPANISH }), id, ENGLISH)
    } finally {
      // RESTORE
      await sut.removeAssetFile(ctxt({ locale: SPANISH }), id)
    }
  })

  test('TEST: createAsset and removeAsset', async () => {
    const context = ctxt({ locale: ENGLISH })
    const contentful = testContentful({
      disableCache: true,
      disableFallbackCache: true,
    })
    const sut = testManageContentful()
    let assetId: string
    const file = JSON.stringify({ a: rndStr(), b: rndStr() })
    const fileName = rndStr()
    const info = {
      description: `${fileName} description`,
      fileName: `${fileName}.json`,
      name: fileName,
      type: 'application/json',
    }
    try {
      // ACT
      const { id, url } = await sut.createAsset(context, file, info)
      assetId = id
      await repeatWithBackoff(async () => {
        const newContent = await contentful.asset(assetId, context)
        expect(newContent.id).toEqual(assetId)
        expect(newContent.info).toEqual(info)
        expect(newContent.url).toEqual(`https:${String(url)}`)
      })
    } finally {
      // RESTORE / ACT
      await sut.removeAsset(context, new AssetId(assetId!, undefined))
      await repeatWithBackoff(async () => {
        await expect(contentful.asset(assetId, context)).rejects.toThrow(
          CmsException
        )
      })
    }
  })

  test('TEST: removeAsset fails if the content does not exists', async () => {
    const context = ctxt({ locale: ENGLISH })
    const sut = testManageContentful()
    // ACT
    await expect(
      sut.removeAsset(context, new AssetId(rndStr(), undefined))
    ).rejects.toThrow(CmsException)
  })
})
