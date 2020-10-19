import { ContentsValidator } from '../../src/tools/validate-all-contents'
import { testContentful } from '../contentful/contentful.helper'

test('TEST: ContentsValidator.validateAllTopContents', async () => {
  const contentful = testContentful()
  const sut = new ContentsValidator(contentful)

  // act
  await sut.validateAllTopContents({ locale: 'es' })

  // assert
  expect(sut.report.errors).toEqual([])
}, 60000)
