import {
  ContentsValidator,
  DefaultContentsValidatorReports,
} from '../../src/tools/validate-all-contents'
import { testContentful } from '../contentful/contentful.helper'

test('TEST: ContentsValidator.validateAllTopContents', async () => {
  const contentful = testContentful()
  const report = new DefaultContentsValidatorReports()
  const sut = new ContentsValidator(contentful, report, true, [
    '2mlEy6WndAoTvfGY15qlJz', // RATING
  ])

  // act
  await sut.validateAllTopContents({ locale: 'es' })

  // assert
  expect(sut.report.errors).toEqual([])
  // assert each content is only validated once
  expect(sut.report.successContents.length).toEqual(
    new Set(sut.report.successContents).size
  )
  expect(sut.report.successContents.length).toEqual(82)
}, 60000)
