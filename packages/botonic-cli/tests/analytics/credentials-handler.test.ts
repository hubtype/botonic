import {
  BotCredentialsHandler,
  CredentialsHandler,
  GlobalCredentialsHandler,
} from '../../src/analytics/credentials-handler'
import {
  createTempDir,
  pathExists,
  removeRecursively,
} from '../../src/util/file-system'

describe('TEST: CredentialsHandler', () => {
  let tempDir = ''
  let credentialsHandler: CredentialsHandler

  beforeEach(() => {
    tempDir = createTempDir('botonic-tmp')
    credentialsHandler = new CredentialsHandler({
      homeDir: tempDir,
      filename: '.botonic-creds',
    })
  })

  afterEach(() => {
    removeRecursively(tempDir)
  })
  it('Initializes correctly the given path', () => {
    const sut = pathExists(credentialsHandler.homeDir)
    expect(sut).toBeTruthy()
  })
  it('Loads/Dumps correctly the data', () => {
    expect(pathExists(credentialsHandler.pathToCredentials)).toBeFalsy()
    credentialsHandler.dump({ dummy: 'content' })
    expect(pathExists(credentialsHandler.pathToCredentials)).toBeTruthy()
    const { dummy } = credentialsHandler.load()
    expect(dummy).toEqual('content')
  })
  it('Generates a random id', () => {
    const sut = credentialsHandler.generateId()
    expect(sut).toEqual(expect.any(String))
  })
})

describe('TEST: GlobalCredentialsHandler', () => {
  let globalCredsHandler: GlobalCredentialsHandler

  beforeEach(() => {
    globalCredsHandler = new GlobalCredentialsHandler()
  })

  afterEach(() => {})

  it('Initializes correctly', () => {
    const sut = pathExists(globalCredsHandler.homeDir)
    expect(sut).toBeTruthy()
    const hasAnonymousId = globalCredsHandler.hasAnonymousId()
    expect(hasAnonymousId).toBeTruthy()
    const credentials = globalCredsHandler.load()
    expect(credentials).toMatchObject({
      analytics: { anonymous_id: expect.any(String) },
    })
  })
  it('Handles ids properly', () => {
    const currentAnonymousId = globalCredsHandler.getAnonymousId()
    globalCredsHandler.refreshAnonymousId()
    const refreshedAnonymousId = globalCredsHandler.getAnonymousId()
    expect(currentAnonymousId).not.toEqual(refreshedAnonymousId)
    globalCredsHandler.dump({ analytics: { anonymous_id: currentAnonymousId } })
  })
})

describe('TEST: BotCredentialsHandler', () => {
  let botCredentialsHandler: BotCredentialsHandler

  beforeEach(() => {
    botCredentialsHandler = new BotCredentialsHandler()
  })

  afterEach(() => {
    removeRecursively(botCredentialsHandler.pathToCredentials)
  })

  it('Initializes correctly', () => {
    const sut = pathExists(botCredentialsHandler.homeDir)
    expect(sut).toBeTruthy()
  })
  it('Loads/Dumps correclty', () => {
    expect(botCredentialsHandler.load()).toBeFalsy()
    const botInfo = {
      bot: {
        id: '1234',
        name: 'bot-name',
        organization: 'org-id',
        last_update: {
          version: '',
          created_at: '',
          modified_at: '',
          published_at: '',
          comment: '',
        },
        created_at: '2020-12-18T15:57:49.871489Z',
        provider_accounts: [],
        is_debug: false,
        is_published: true,
        active_users: 1,
      },
    }
    botCredentialsHandler.dump(botInfo)
    expect(botCredentialsHandler.load()).toMatchObject(botInfo)
  })
})
