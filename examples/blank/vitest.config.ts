import { packageTests } from '@botonic/dx-new-stack/baseline/vitest.config'

export default packageTests(import.meta.url, { react: false, botApp: true })
