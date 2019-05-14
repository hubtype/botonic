import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import * as fs from 'fs';
import * as os from 'os';

/**
 * At least Dynamo gets the keys from ~/.aws/credentials, but it does not get the region from ~/.aws/config
 * @param conf
 */
export function testConfig(
  conf?: ServiceConfigurationOptions
): ServiceConfigurationOptions {
  if (!conf || !conf.secretAccessKey || !conf.accessKeyId) {
    let credentials = os.homedir() + '/.aws/credentials';
    if (!fs.existsSync(credentials)) {
      console.warn(
        `Credentials file not found at ${credentials}. Are you authenticating some other way?`
      );
    }
  }
  conf = conf || {};
  conf.region = conf.region || 'eu-west-1';
  return conf;
}
