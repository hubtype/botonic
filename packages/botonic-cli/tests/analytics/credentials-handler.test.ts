import { join } from 'path'

import { GlobalCredentialsHandler } from '../../src/analytics/credentials-handler'
import { pathExists, remove } from '../../src/util/file-system'

describe('TEST: GlobalCredentialsHandler', () => {
  it('Initializes correctly credentials', () => {
    const path = join(process.cwd(), '.botonic-creds')
    const credentialsHandler = new GlobalCredentialsHandler()
    expect(pathExists(credentialsHandler.pathToCredentials)).toBeTruthy()
    expect(credentialsHandler.read()).toMatchObject({
      analytics: { anonymous_id: expect.any(Number) },
    })
    remove(path)
  })
})
