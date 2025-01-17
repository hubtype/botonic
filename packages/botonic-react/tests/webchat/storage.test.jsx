/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

import { act, render } from '@testing-library/react'
import React from 'react'

import { WEBCHAT } from '../../src/constants'
import { Webchat } from '../../src/webchat/webchat'
import { InMemoryStorage } from '../helpers/in-memory-storage'

describe('TEST: storage', () => {
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('Stores botonicState in the localStorage by default with its default values', async () => {
    await act(async () => {
      render(
        <Webchat
          storage={localStorage}
          storageKey={WEBCHAT.DEFAULTS.STORAGE_KEY}
        />
      )
    })
    const botonicState = JSON.parse(localStorage.getItem('botonicState'))
    expect(botonicState.session.user).toHaveProperty('id' && 'name')
    expect(botonicState).toHaveProperty('messages', [])
    expect(botonicState).toHaveProperty('session')
    expect(botonicState.lastRoutePath).toBe(undefined)
    expect(botonicState).toHaveProperty('devSettings', {
      keepSessionOnReload: false,
    })
    expect(sessionStorage.getItem('botonicState')).toBeNull()
  })

  it('Stores botonicState in the localStorage', async () => {
    await act(async () => {
      render(
        <Webchat
          storage={localStorage}
          storageKey={WEBCHAT.DEFAULTS.STORAGE_KEY}
        />
      )
    })
    expect(localStorage.getItem('botonicState')).not.toBeNull()
    expect(sessionStorage.getItem('botonicState')).toBeNull()
  })

  it('Stores botonicState in the sessionStorage', async () => {
    await act(async () => {
      render(
        <Webchat
          storage={sessionStorage}
          storageKey={WEBCHAT.DEFAULTS.STORAGE_KEY}
        />
      )
    })
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(sessionStorage.getItem('botonicState')).not.toBeNull()
  })

  it('Stores botonicState in the memory storage', async () => {
    const inMemoryStorage = new InMemoryStorage()
    await act(async () => {
      render(
        <Webchat
          storage={inMemoryStorage}
          storageKey={WEBCHAT.DEFAULTS.STORAGE_KEY}
        />
      )
    })
    const botonicState = JSON.parse(inMemoryStorage.getItem('botonicState'))
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(sessionStorage.getItem('botonicState')).toBeNull()
    expect(botonicState).not.toBeNull()
    expect(botonicState).toHaveProperty('messages', [])
  })

  it('Does not store botonicState', async () => {
    await act(async () => {
      render(
        <Webchat storage={null} storageKey={WEBCHAT.DEFAULTS.STORAGE_KEY} />
      )
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
      render(<Webchat storage={localStorage} storageKey='myCustomKey' />)
    })
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(localStorage.getItem('myCustomKey')).not.toBeNull()
  })

  it('Stores botonicState in the localStorage key returned if storageKey is a function', async () => {
    await act(async () => {
      render(
        <Webchat storage={localStorage} storageKey={() => 'myCustomKey'} />
      )
    })
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(localStorage.getItem('myCustomKey')).not.toBeNull()
  })

  it('Inits session correctly with user id (corrupted localStorage)', async () => {
    localStorage.setItem(
      'botonicState',
      '{"user":{"extra_data":{"url":"https://www.some-domain.com/","lang":"GB_en"}},"messages":[],"session":{"user":{"extra_data":{"url":"https://www.some-domain.com/","lang":"GB_en"}}},"lastRoutePath":null,"devSettings":{},"lastMessageUpdate":"2020-12-04T16:30:11.833Z"}'
    )
    await act(async () => {
      render(
        <Webchat
          storage={localStorage}
          storageKey={WEBCHAT.DEFAULTS.STORAGE_KEY}
        />
      )
    })
    const botonicState = JSON.parse(localStorage.getItem('botonicState'))
    expect(localStorage.getItem('botonicState')).not.toBeNull()
    expect(botonicState.session.user.id).not.toBeFalsy()
  })
})
