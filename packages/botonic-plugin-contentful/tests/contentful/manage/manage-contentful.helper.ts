import { ContentfulOptions } from '../../../src'
import { testContentfulOptions } from '../contentful.helper'
import { ManageContentful } from '../../../src/contentful/manage/manage-contentful'
import { ErrorReportingManageCms } from '../../../src/manage-cms/manage-cms-error'

export function testManageContentful(options: Partial<ContentfulOptions> = {}) {
  const manage = new ManageContentful(
    testContentfulOptions({
      ...options,
      accessToken: process.env.CONTENTFUL_TEST_MANAGE_TOKEN!,
    })
  )
  return new ErrorReportingManageCms(manage)
}
