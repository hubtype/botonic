export const plugins = [
  {
    id: 'track',
    resolve: require('@botonic/plugin-dynamodb'),
    options: {
      // TODO update configuration below
      env: 'dev',
      accessKeyId: 'YOUR AWS ACCESS KEY HERE',
      secretAccessKey: 'YOUR AWS SECRET KEY HERE', // pragma: allowlist secret
      region: 'eu-west-1',
    },
  },
]
