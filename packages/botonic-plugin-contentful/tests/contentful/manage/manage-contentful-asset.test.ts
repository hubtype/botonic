import { ENGLISH, SPANISH } from '../../../src/nlp'
import { testManageContentful } from './manage-contentful.helper'
import { ManageContext } from '../../../src/manage-cms'
import { TEST_ASSET_ID } from '../contents/asset.test'

// Since the tests modify contentful contents, they might fail if executed
// more than once simultaneously (eg from 2 different branches from CI)
describe('ManageContentful assets', () => {
  function ctxt(ctx: Partial<ManageContext>): ManageContext {
    return { ...ctx, preview: false } as ManageContext
  }

  test('TEST: copyAssetFile', async () => {
    const sut = testManageContentful()

    try {
      // ACT
      await sut.copyAssetFile(ctxt({ locale: SPANISH }), TEST_ASSET_ID, ENGLISH)
    } finally {
      // RESTORE
      await sut.removeAssetFile(ctxt({ locale: SPANISH }), TEST_ASSET_ID)
    }
  })
})
