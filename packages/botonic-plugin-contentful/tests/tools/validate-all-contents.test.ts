import { ContentsValidator } from '../../src/tools/validate-all-contents'
import { testContentful } from '../contentful/contentful.helper'

test('ContentsValidator', async () => {
  const contentful = testContentful({})
  const sut = new ContentsValidator(contentful)
  await sut.validateAllTopContents({ locale: 'es' })
})
