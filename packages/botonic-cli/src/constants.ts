import { join } from 'path'
import { cwd } from 'process'

export const BOTONIC_NPM_NAMESPACE = '@botonic'
export const BOTONIC_HOME_DIRNAME = '.botonic'
export const GLOBAL_CREDS_FILENAME = 'credentials.json'
export const BOTONIC_PROJECT_PATH = process.cwd()
export const BOT_CREDS_FILENAME = '.botonic.json'
export const ANALYTICS_WRITE_KEY = 'YD0jpJHNGW12uhLNbgB4wbdTRQ4Cy1Zu'
export const CLOUD_PROVIDERS = Object.freeze({
  AWS: 'aws',
  HUBTYPE: 'hubtype',
})
export const AWS_CLOUD_CONFIG_FILENAME = 'aws.config.js'
export const PATH_TO_AWS_CONFIG = join(cwd(), AWS_CLOUD_CONFIG_FILENAME)
