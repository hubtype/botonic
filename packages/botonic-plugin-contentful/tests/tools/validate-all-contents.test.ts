import { ContentsValidator } from '../../src/tools/validate-all-contents'
import { testContentful } from '../contentful/contentful.helper'

test('TEST: ContentsValidator.validateAllTopContents', async () => {
  const contentful = testContentful({})
  const errors: string[] = []
  const report = (contentId: string, error: string) => {
    errors.push(contentId + '/' + error)
  }
  const sut = new ContentsValidator(contentful, report)

  // act
  await sut.validateAllTopContents({ locale: 'en' })

  // assert
  expect(errors).toEqual([])
})
