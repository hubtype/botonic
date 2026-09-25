import { botAppConfig } from '@botonic/dx-new-stack/baseline/rspack.config'

export default (
  env: Parameters<typeof botAppConfig>[1],
  argv: Parameters<typeof botAppConfig>[2]
) => botAppConfig(import.meta.url, env, argv)
