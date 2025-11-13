import {
  BotCredentialsHandler,
  CredentialsHandler,
} from '../../src/util/credentials-handler.js'
import {
  createTempDir,
  pathExists,
  removeRecursively,
} from '../../src/util/file-system.js'

describe('TEST: CredentialsHandler', () => {
  let tempDir = ''
  let credentialsHandler: CredentialsHandler

  beforeEach(() => {
    tempDir = createTempDir('botonic-tmp')
    credentialsHandler = new CredentialsHandler({
      homeDir: tempDir,
      filename: '.botonic-credentials',
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
    credentialsHandler.dumpJSON({ dummy: 'content' })
    expect(pathExists(credentialsHandler.pathToCredentials)).toBeTruthy()
    const content = credentialsHandler.loadJSON()
    expect(content?.dummy).toEqual('content')
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
  it('Loads/Dumps correctly', () => {
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
