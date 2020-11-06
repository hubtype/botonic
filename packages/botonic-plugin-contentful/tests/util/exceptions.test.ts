import { CmsException } from '../../src/cms'
import { ensureError, isError } from '../../src/util/exceptions'

test('TEST: isError', () => {
  expect(isError(new Error('msg'))).toBe(true)
  expect(isError('msg')).toBe(false)
  expect(isError({ o: 1 })).toBe(false)
})

test('TEST: ensureError', () => {
  const e = new Error('msg')
  expect(ensureError(e)).toBe(e)
  expect(ensureError('msg')).toEqual(new CmsException('msg'))
})
