import { CMS, SupportedLocales } from '../../../src/cms'
import { createCms } from '../../../src/factories'
import { DirectusOptions } from '../../../src/plugin'

export function testDirectus(): CMS {
  return createCms(testDirectusOptions())
}

export function testDirectusOptions(): DirectusOptions {
  return {
    credentials: {
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9kldsncuierUYVRTCVL87',
      apiEndPoint: 'http://directus2-2065312077.eu-west-1.elb.amazonaws.com/',
    },
    keywordOptions: {},
  }
}

export function testContext(): SupportedLocales {
  return SupportedLocales.SPANISH
}
