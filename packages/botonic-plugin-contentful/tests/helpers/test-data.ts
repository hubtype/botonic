import { TopContentId, ContentType } from '../../src/cms'
import { rndStr } from '../../src/cms/test-helpers'

export function testContentId(): TopContentId {
  return new TopContentId(ContentType.TEXT, rndStr())
}
