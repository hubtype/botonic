import { assert } from 'console'

import { GlobalCredentialsHandler } from '../../src/analytics/credentials-handler'
import { Telemetry } from '../../src/analytics/telemetry'
import { pathExists } from '../../src/util/file-system'

process.env.BOTONIC_DISABLE_ANALYTICS = '1'

describe('TEST: Telemetry', () => {
  let telemetry: Telemetry
  let globalCredentialsHandler: GlobalCredentialsHandler

  beforeEach(() => {
    telemetry = new Telemetry()
    if (telemetry.globalCredentialsHandler)
      globalCredentialsHandler = telemetry.globalCredentialsHandler
  })

  afterEach(() => {})
  it('Initializes correctly Telemetry', () => {
    expect(telemetry.isAnalyticsEnabled).toBe(false)
    expect(telemetry.analyticsService).toBeTruthy()
    const homeDir = globalCredentialsHandler.homeDir
    expect(pathExists(homeDir)).toBeTruthy()
  })
  it('Creates anonymousId if not exists', () => {
    let anonymousId: string | undefined = undefined
    const currentInfo = globalCredentialsHandler.load()
    globalCredentialsHandler.dump({
      analytics: { anonymous_id: '' },
    })
    globalCredentialsHandler.load()
    assert(!globalCredentialsHandler.getAnonymousId())
    anonymousId = telemetry.createAnonymousIdIfNotExists()
    if (currentInfo) globalCredentialsHandler.dump(currentInfo)
    expect(anonymousId).toBeTruthy()
  })
  it('Generates the correct properties', () => {
    const sut = Object.keys(
      telemetry.getTelemetryProperties({ addedField: 'test' })
    )
    expect(sut).toEqual([
      'platform',
      'arch',
      'timezone',
      'timestamp',
      'is_tty',
      'framework_path',
      'system_path',
      'node_version',
      'botonic_cli_version',
      'botonic_dependencies',
      'addedField',
    ])
  })
  it('Do telemetry calls properly', () => {
    const track = (Telemetry.prototype.track = jest.fn())
    const trackLogin = (Telemetry.prototype.trackLogin = jest.fn())
    const trackLogout = (Telemetry.prototype.trackLogout = jest.fn())
    const trackCreate = (Telemetry.prototype.trackCreate = jest.fn())
    const trackServe = (Telemetry.prototype.trackServe = jest.fn())
    const trackTest = (Telemetry.prototype.trackTest = jest.fn())
    const trackTrain = (Telemetry.prototype.trackTrain = jest.fn())
    const trackInstallBotonic = (Telemetry.prototype.trackInstallBotonic = jest.fn())
    const trackDeploy = (Telemetry.prototype.trackDeploy = jest.fn())
    const trackError = (Telemetry.prototype.trackError = jest.fn())

    telemetry.track('some event', {})
    expect(track).toHaveBeenCalledTimes(1)

    telemetry.trackLogin()
    expect(trackLogin).toHaveBeenCalledTimes(1)

    telemetry.trackLogout()
    expect(trackLogout).toHaveBeenCalledTimes(1)

    telemetry.trackCreate()
    expect(trackCreate).toHaveBeenCalledTimes(1)

    telemetry.trackServe()
    expect(trackServe).toHaveBeenCalledTimes(1)

    telemetry.trackTest()
    expect(trackTest).toHaveBeenCalledTimes(1)

    telemetry.trackTrain()
    expect(trackTrain).toHaveBeenCalledTimes(1)

    telemetry.trackInstallBotonic()
    expect(trackInstallBotonic).toHaveBeenCalledTimes(1)

    telemetry.trackDeploy()
    expect(trackDeploy).toHaveBeenCalledTimes(1)

    telemetry.trackError('error')
    expect(trackError).toHaveBeenCalledTimes(1)
  })
})
