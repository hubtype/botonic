import { ContentfulOptions } from '../../../src'
import { createManageCms } from '../../../src/contentful/factories'
import { ManageEnvironment } from '../../../src/contentful/manage/manage-environment'
import { ManageContext } from '../../../src/manage-cms'
import {
  testContentfulOptions,
  testManageToken,
  testSpaceId,
} from '../contentful.helper'

export const MANAGE_CONTENTFUL_ENV = 'manage-contentful'

export function testManageContentful(options: Partial<ContentfulOptions> = {}) {
  if (!process.env.CONTENTFUL_TEST_MANAGE_TOKEN) {
    throw new Error('You need to set env var CONTENTFUL_TEST_MANAGE_TOKEN')
  }
  return createManageCms(
    testContentfulOptions({
      ...options,
      accessToken: process.env.CONTENTFUL_TEST_MANAGE_TOKEN,
    })
  )
}

export function testManageEnvironment() {
  return new ManageEnvironment({
    spaceId: testSpaceId(),
    accessToken: testManageToken(),
  })
}

export function ctxt(ctx: Partial<ManageContext>): ManageContext {
  return { ...ctx, preview: false } as ManageContext
}
