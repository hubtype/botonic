import { CmsException, ContentId, ContentType, ResourceId } from '../../src/cms'

describe('CMSException', () => {
  test.each([
    [
      'm1',
      new Error('cause'),
      new ContentId(ContentType.URL, 'ID'),
      `m1 on content 'url' with id 'ID'. cause`,
    ],
    ['m1', 'non-exception', undefined, 'm1. non-exception'],
    ['m1', undefined, undefined, 'm1'],
  ])(
    'TEST: CMSException (%s, %s, %s) => %s',
    (
      msg: string,
      reason: any,
      resourceId: ResourceId | undefined,
      expectedToString: string
    ) => {
      const sut = new CmsException(msg, reason, resourceId)
      expect(sut.message).toEqual(expectedToString)
      expect(sut.toString()).toEqual(`Error: ${expectedToString}`)
      expect(String(sut)).toEqual(`Error: ${expectedToString}`)
    }
  )
})
