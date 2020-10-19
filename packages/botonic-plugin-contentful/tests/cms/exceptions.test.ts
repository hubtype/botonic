import { CmsException } from '../../src/cms'

describe('CMSException', () => {
  test.each([
    ['msg1.', new Error('cause error'), 'msg1. Due to: cause error'],
    ['msg1.', 'non-Error exception', 'msg1. Due to: non-Error exception'],
    ['msg1', undefined, 'msg1'],
  ])(
    'TEST: CMSException (%s, %s) => %s',
    (msg: string, reason: any, expectedToString: string) => {
      const sut = new CmsException(msg, reason)
      expect(sut.message).toEqual(expectedToString)
      expect(sut.toString()).toEqual(`Error: ${expectedToString}`)
      expect(String(sut)).toEqual(`Error: ${expectedToString}`)
    }
  )
})
