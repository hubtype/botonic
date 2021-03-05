import { assert } from 'console'

import { Telemetry } from '../../src/analytics/telemetry'
import { pathExists } from '../../src/util/file-system'

process.env.BOTONIC_DISABLE_ANALYTICS = '1'
assert(process.env.BOTONIC_DISABLE_ANALYTICS === '1')

describe('TEST: Telemetry', () => {
  let telemetry: Telemetry
  beforeEach(() => {
    telemetry = new Telemetry()
  })

  afterEach(() => {})
  it('Initializes correctly Telemetry', () => {
    expect(telemetry.isAnalyticsEnabled).toBe(false)
    expect(telemetry.analyticsService).toBeTruthy()
    expect(pathExists(telemetry.globalCredentialsHandler.homePath)).toBeTruthy()
  })
  it('Creates anonymousId if not exists', () => {
    const currentInfo = telemetry.globalCredentialsHandler.load()
    telemetry.globalCredentialsHandler.dump({
      analytics: { anonymous_id: '' },
    })
    telemetry.globalCredentialsHandler.load()
    assert(!telemetry.globalCredentialsHandler.getAnonymousId())
    const anonymousId = telemetry.createAnonymousIdIfNotExists()
    expect(anonymousId).toBeTruthy()
    telemetry.globalCredentialsHandler.dump(currentInfo)
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
    const trackLoggedIn = (Telemetry.prototype.trackLoggedIn = jest.fn())
    const trackLoggedOut = (Telemetry.prototype.trackLoggedOut = jest.fn())
    const trackCreated = (Telemetry.prototype.trackCreated = jest.fn())
    const trackServed = (Telemetry.prototype.trackServed = jest.fn())
    const trackTested = (Telemetry.prototype.trackTested = jest.fn())
    const trackTrained = (Telemetry.prototype.trackTrained = jest.fn())
    const trackInstalledBotonic = (Telemetry.prototype.trackInstalledBotonic = jest.fn())
    const trackDeployed = (Telemetry.prototype.trackDeployed = jest.fn())
    const trackError = (Telemetry.prototype.trackError = jest.fn())

    telemetry.track('some event', {})
    telemetry.trackLoggedIn()
    telemetry.trackLoggedOut()
    telemetry.trackCreated()
    telemetry.trackServed()
    telemetry.trackTested()
    telemetry.trackTrained()
    telemetry.trackInstalledBotonic()
    telemetry.trackDeployed()
    telemetry.trackError('error')

    expect(track).toHaveBeenCalledTimes(1)
    expect(trackLoggedIn).toHaveBeenCalledTimes(1)
    expect(trackLoggedOut).toHaveBeenCalledTimes(1)
    expect(trackCreated).toHaveBeenCalledTimes(1)
    expect(trackServed).toHaveBeenCalledTimes(1)
    expect(trackTested).toHaveBeenCalledTimes(1)
    expect(trackLoggedIn).toHaveBeenCalledTimes(1)
    expect(trackTrained).toHaveBeenCalledTimes(1)
    expect(trackInstalledBotonic).toHaveBeenCalledTimes(1)
    expect(trackDeployed).toHaveBeenCalledTimes(1)
    expect(trackError).toHaveBeenCalledTimes(1)
  })
})
