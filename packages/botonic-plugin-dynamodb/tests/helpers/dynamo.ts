import * as fs from 'fs'
import * as os from 'os'
import { DynamoDbOptions } from '../../src'

/**
 * At least Dynamo gets the keys from ~/.aws/credentials, but it does not get the region from ~/.aws/config
 * https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
 * @param conf
 */
export function testConfig(conf: DynamoDbOptions): DynamoDbOptions {
  if (!conf || !conf.secretAccessKey || !conf.accessKeyId) {
    const credentials = os.homedir() + '/.aws/credentials'
    if (!fs.existsSync(credentials)) {
      console.error(
        `Credentials file not found at ${credentials}. Are you authenticating some other way?`
      )
    }
  }
  conf.region = conf.region || 'eu-west-1'
  return conf
}
