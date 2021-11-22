import { testDirectus } from '../helpers/directus.helper'

test('Test: create file', async () => {
  const rndStr = () => {
    return Math.random().toString()
  }
  const file = JSON.stringify({ a: rndStr(), b: rndStr() })
  const directus = testDirectus()

  await directus.createAsset(file, {})
})
