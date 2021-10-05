import { ContentType } from '../../../../src/cms'
import { testContext, testDirectus } from '../../helpers/directus.helper'

export async function createContents(
  contentTypePerId: Record<string, ContentType>
): Promise<void> {
  const directus = testDirectus()
  for (const id of Object.keys(contentTypePerId)) {
    await directus.createContent(testContext(), contentTypePerId[id], id)
  }
}

export async function deleteContents(
  contentTypePerId: Record<string, ContentType>
): Promise<void> {
  const directus = testDirectus()
  for (const id of Object.keys(contentTypePerId)) {
    await directus.deleteContent(testContext(), contentTypePerId[id], id)
  }
}

export function generateRandomUUID() {
  var dt = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0
      dt = Math.floor(dt / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    }
  )
  return uuid
}
