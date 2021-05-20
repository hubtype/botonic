import { AssetId } from '../../../src/cms'
import { ENGLISH, SPANISH } from '../../../src/nlp'
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
})
