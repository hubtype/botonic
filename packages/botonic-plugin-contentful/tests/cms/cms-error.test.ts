import { anything, instance, mock, when } from 'ts-mockito'

import { CmsException, DummyCMS, ErrorReportingCMS, SPANISH } from '../../src'
import { CarouselBuilder } from '../../src/cms/factories'
import { testContentful } from '../contentful/contentful.helper'

test('TEST: ErrorReportingCMS integration test', async () => {
  const sut = testContentful({}, true)
  expect.assertions(1)
  await sut.text('invalid_id').catch(error => {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(error).toBeInstanceOf(CmsException)
  })
})

test('TEST: ErrorReportingCMS content delivery failed', async () => {
  const mockCms = mock(DummyCMS)
  const error = new Error('mock error')
  when(mockCms.carousel('id1', undefined)).thenReject(error)
  const sut = new ErrorReportingCMS(instance(mockCms))

  await sut
    .carousel('id1')
    .then(_carousel => {
      throw Error('should have thrown')
    })
    .catch((error2: any) => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error2).toEqual(
        new CmsException(
          "Error calling CMS.carousel on 'carousel' with id 'id1'",
          error
        )
      )
    })

  when(mockCms.text('id1', anything())).thenReject(error)
  await sut
    .text('id1', { locale: SPANISH })
    .then(_text => {
      throw Error('should have thrown')
    })
    .catch((error2: any) => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error2).toEqual(
        new CmsException(
          "Error calling CMS.text with locale 'es' on 'text' with id 'id1'",
          error
        )
      )
    })
})

test('TEST: ErrorReportingCMS carousel delivery ok validation fails', async () => {
  const mockCms = mock(DummyCMS)
  const builder = new CarouselBuilder('id', 'name')
  builder.withElementBuilder('elementId').withButtons([])
  const carousel = builder.build()

  when(mockCms.carousel('id1', undefined)).thenResolve(carousel)
  const sut = new ErrorReportingCMS(instance(mockCms))

  await sut.carousel('id1').then(c => {
    expect(c).toEqual(carousel)
    return
  })
})
