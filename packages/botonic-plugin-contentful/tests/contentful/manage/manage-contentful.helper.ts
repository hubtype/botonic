import { ContentfulOptions } from '../../../src'
import { createManageCms } from '../../../src/contentful/factories'
import { testContentfulOptions } from '../contentful.helper'

export function testManageContentful(options: Partial<ContentfulOptions> = {}) {
  return createManageCms(
    testContentfulOptions({
      ...options,
      accessToken: process.env.CONTENTFUL_TEST_MANAGE_TOKEN!,
    })
  )
}
