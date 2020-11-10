import { anything, instance, mock, when } from 'ts-mockito'

import {
  Carousel,
  CmsException,
  DummyCMS,
  ErrorReportingCMS,
  SPANISH,
} from '../../src'
import { testContentful } from '../contentful/contentful.helper'

test('TEST: ErrorReportingCMS integration test', async () => {
  const contentful = testContentful()
  const sut = new ErrorReportingCMS(contentful)
  expect.assertions(1)
  await sut.text('invalid_id').catch(error => {
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
    .then(carousel => {
      throw Error('should have thrown')
    })
    .catch((error2: any) => {
      expect(error2).toEqual(
        new CmsException(
          "Error calling CMS.carousel on 'carousel' with id 'id1'.",
          error
        )
      )
    })

  when(mockCms.text('id1', anything())).thenReject(error)
  await sut
    .text('id1', { locale: SPANISH })
    .then(text => {
      throw Error('should have thrown')
    })
    .catch((error2: any) => {
      expect(error2).toEqual(
        new CmsException(
          "Error calling CMS.text with locale 'es' on 'text' with id 'id1'.",
          error
        )
      )
    })
})

test('TEST: ErrorReportingCMS carousel delivery ok', async () => {
  const mockCms = mock(DummyCMS)
  const carousel = mock(Carousel)
  when(carousel.validate()).thenReturn('invalid carousel')

  when(mockCms.carousel('id1', undefined)).thenResolve(instance(carousel))
  const sut = new ErrorReportingCMS(instance(mockCms))

  await sut.carousel('id1').then(c => {
    expect(c).toEqual(instance(carousel))
    return
  })
})
