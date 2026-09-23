import type { Configuration } from '@rspack/cli'

export declare function botAppConfig(
  packageUrl: string,
  env: {
    target: 'all' | 'dev' | 'node' | 'webchat' | 'webviews' | 'bot-config'
  },
  argv: { mode: 'development' | 'production' }
): Configuration[]
