import { packageTests } from './baseline/vitest.config.mjs'

export default packageTests(import.meta.url, { botApp: true })
