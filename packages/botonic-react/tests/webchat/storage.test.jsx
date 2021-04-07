import React from 'react'
import { act } from 'react-test-renderer'
import { snapshot_UNSTABLE } from 'recoil'

import { sessionState } from '../../src/webchat/recoil/atoms'
import { Webchat } from '../../src/webchat/webchat'
import { RecoilRenderer } from '../helpers/test-utils'

describe('TEST: storage', () => {
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('Stores botonicState in the localStorage by default with its default values', async () => {
    await act(async () => {
      RecoilRenderer(<Webchat />)
    })
    const initialSnapshot = snapshot_UNSTABLE()
    const botonicState = JSON.parse(localStorage.getItem('botonicState'))
    const botonicSession = initialSnapshot
      .getLoadable(sessionState)
      .valueOrThrow()

    expect(botonicSession).toBeTruthy()
    expect(botonicSession.user).toHaveProperty('id' && 'name')
    expect(botonicState).toHaveProperty('messages', [])
    expect(botonicState).toHaveProperty('lastRoutePath', null)
    expect(botonicState).toHaveProperty('devSettings', {
      keepSessionOnReload: false,
    })
    expect(sessionStorage.getItem('botonicState')).toBeNull()
  })

  it('Stores botonicState in the localStorage', async () => {
    await act(async () => {
      RecoilRenderer(<Webchat storage={localStorage} />)
    })
    expect(localStorage.getItem('botonicState')).not.toBeNull()
    expect(sessionStorage.getItem('botonicState')).toBeNull()
  })

  it('Stores botonicState in the sessionStorage', async () => {
    await act(async () => {
      RecoilRenderer(<Webchat storage={sessionStorage} />)
    })
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(sessionStorage.getItem('botonicState')).not.toBeNull()
  })

  it('Does not store botonicState', async () => {
    await act(async () => {
      RecoilRenderer(<Webchat storage={null} />)
    })
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(sessionStorage.getItem('botonicState')).toBeNull()
  })
})

describe('TEST: storageKey', () => {
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('Stores botonicState in the localStorage key defined in the settings', async () => {
    await act(async () => {
      RecoilRenderer(<Webchat storageKey='myCustomKey' />)
    })
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(localStorage.getItem('myCustomKey')).not.toBeNull()
  })

  it('Stores botonicState in the localStorage key returned if storageKey is a function', async () => {
    await act(async () => {
      RecoilRenderer(<Webchat storageKey={() => 'myCustomKey'} />)
    })
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(localStorage.getItem('myCustomKey')).not.toBeNull()
  })

  it('Stores botonicState in the default localStorage key if storageKey is null', async () => {
    await act(async () => {
      RecoilRenderer(<Webchat storageKey={null} />)
    })
    expect(localStorage.getItem('botonicState')).not.toBeNull()
    expect(localStorage.getItem('myCustomKey')).toBeNull()
  })

  it.skip('Inits session correctly with user id (corrupted localStorage)', async () => {
    localStorage.setItem(
      'botonicState',
      '{"user":{"extra_data":{"url":"https://www.some-domain.com/","lang":"GB_en"}},"messages":[],"session":{"user":{"extra_data":{"url":"https://www.some-domain.com/","lang":"GB_en"}}},"lastRoutePath":null,"devSettings":{},"lastMessageUpdate":"2020-12-04T16:30:11.833Z"}'
    )
    await act(async () => {
      RecoilRenderer(<Webchat storage={localStorage} />)
    })
    const botonicState = JSON.parse(localStorage.getItem('botonicState'))
    expect(localStorage.getItem('botonicState')).not.toBeNull()
    expect(botonicState.session.user.id).not.toBeFalsy()
  })
})
