/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

import {
  createUser,
  initSession,
  shouldKeepSessionOnReload,
} from '../../src/util/webchat'

describe('TEST: User Creation', () => {
  it('Creates a new user', () => {
    const sut = createUser()
    expect(sut.id).toBeTruthy()
    expect(sut.name).toMatch('WebKit')
  })
})

describe('TEST: Session initialization', () => {
  it('Initializes a new session', () => {
    const sessionUnexistent = undefined
    const sut = initSession(sessionUnexistent)
    expect(sut.user.id).toBeTruthy()
    expect(sut.user.name).toMatch('WebKit')
  })
  it('Leaves the session as is (already intialized)', () => {
    const sessionWithUserId = {
      user: { id: '1234', name: 'undefined WebKit' },
      extra_data: 'some-extra-data',
    }
    const sut = initSession(sessionWithUserId)
    expect(sut.user.id).toBeTruthy()
    expect(sut.user.name).toMatch('WebKit')
    expect(sut.extra_data).toEqual('some-extra-data')
  })
  it('Generates a new user id from a corrupted session', () => {
    const sessionWithoutUserId = { extra_data: 'some-extra-data' }
    const sut = initSession(sessionWithoutUserId)
    expect(sut.user.id).toBeTruthy()
    expect(sut.user.name).toMatch('WebKit')
    expect(sut.extra_data).toEqual('some-extra-data')
  })
})

describe('TEST: Keeps session on reload', () => {
  it('Cleans session on reload by default (botonic serve)', () => {
    const initialDevSettings = {
      keepSessionOnReload: false,
      showSessionView: undefined,
    }
    const devSettings = {
      keepSessionOnReload: false,
    }
    const sut = shouldKeepSessionOnReload({ initialDevSettings, devSettings })
    expect(sut).toBe(false)
  })
  it('Does not clean session on reload by after setting keepSessionOnReload to true (botonic serve)', () => {
    const initialDevSettings = {
      keepSessionOnReload: false,
      showSessionView: undefined,
    }
    const devSettings = {
      keepSessionOnReload: true,
    }
    const sut = shouldKeepSessionOnReload({ initialDevSettings, devSettings })
    expect(sut).toBe(true)
  })
  it('Does not clean session on reload (production WebchatApp)', () => {
    const initialDevSettings = undefined
    const devSettings = {
      keepSessionOnReload: false,
    }
    const sut = shouldKeepSessionOnReload({ initialDevSettings, devSettings })
    expect(sut).toBe(true)
  })
})
