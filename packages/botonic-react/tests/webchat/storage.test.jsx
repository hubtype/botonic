import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'

import { Webchat } from '../../src/webchat/webchat'

describe('TEST: storage', () => {
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('Stores botonicState in the localStorage by default with its default values', async () => {
    await act(async () => {
      TestRenderer.create(<Webchat />)
    })
    const botonicState = JSON.parse(localStorage.getItem('botonicState'))
    expect(botonicState.session.user).toHaveProperty('id' && 'name')
    expect(botonicState).toHaveProperty('messages', [])
    expect(botonicState).toHaveProperty('session')
    expect(botonicState).toHaveProperty('lastRoutePath', null)
    expect(botonicState).toHaveProperty('devSettings', {})
    expect(sessionStorage.getItem('botonicState')).toBeNull()
  })

  it('Stores botonicState in the localStorage', async () => {
    await act(async () => {
      TestRenderer.create(<Webchat storage={localStorage} />)
    })
    expect(localStorage.getItem('botonicState')).not.toBeNull()
    expect(sessionStorage.getItem('botonicState')).toBeNull()
  })

  it('Stores botonicState in the sessionStorage', async () => {
    await act(async () => {
      TestRenderer.create(<Webchat storage={sessionStorage} />)
    })
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(sessionStorage.getItem('botonicState')).not.toBeNull()
  })

  it('Does not store botonicState', async () => {
    await act(async () => {
      TestRenderer.create(<Webchat storage={null} />)
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
      TestRenderer.create(<Webchat storageKey='myCustomKey' />)
    })
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(localStorage.getItem('myCustomKey')).not.toBeNull()
  })

  it('Stores botonicState in the localStorage key returned if storageKey is a function', async () => {
    await act(async () => {
      TestRenderer.create(<Webchat storageKey={() => 'myCustomKey'} />)
    })
    expect(localStorage.getItem('botonicState')).toBeNull()
    expect(localStorage.getItem('myCustomKey')).not.toBeNull()
  })

  it('Stores botonicState in the default localStorage key if storageKey is null', async () => {
    await act(async () => {
      TestRenderer.create(<Webchat storageKey={null} />)
    })
    expect(localStorage.getItem('botonicState')).not.toBeNull()
    expect(localStorage.getItem('myCustomKey')).toBeNull()
  })
})
