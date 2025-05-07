import BotonicPluginDynamoDB from '@botonic/plugin-dynamodb'

export const plugins = {
  track: new BotonicPluginDynamoDB({
    env: 'dev',
    accessKeyId: 'YOUR AWS ACCESS KEY HERE',
    secretAccessKey: 'YOUR AWS SECRET KEY HERE', // pragma: allowlist secret
    region: 'eu-west-1',
  }),
}
