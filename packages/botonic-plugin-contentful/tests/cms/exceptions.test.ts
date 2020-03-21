import { CmsException } from '../../src/cms'

describe('CMSException', () => {
  test.each([
    ['msg1', new Error('cause error'), 'msg1 due to: cause error'],
    ['msg1', 'non-Error exception', 'msg1 due to: non-Error exception'],
    ['msg1', undefined, 'msg1'],
  ])(
    'TEST: CMSException',
    (msg: string, reason: any, expectedToString: string) => {
      const sut = new CmsException(msg, reason)
      expect(sut.toString()).toEqual(expectedToString)
    }
  )
})
