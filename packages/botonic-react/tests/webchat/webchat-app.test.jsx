import { act, render, screen } from '@testing-library/react'

import { ROLES } from '../../src/constants'
import { WebchatApp } from '../../src/webchat-app'
import { expectNotToHaveRoles, expectToHaveRoles } from '../helpers/test-utils'

describe('TEST: Webchat App', () => {
  // https://stackoverflow.com/questions/42805128/does-jest-reset-the-jsdom-document-after-every-suite-or-test
  afterEach(() => {
    document.getElementsByTagName('body')[0].innerHTML = ''
  })

  // To avoid TypeError: frame.scrollTo is not a function
  window.HTMLElement.prototype.scrollTo = function () {}

  it('TEST: WebchatApp adds <div id="root"> to DOM on initialize', async () => {
    const webchatApp = new WebchatApp({})
    expect(document.body.querySelector('#root')).toBeTruthy()
  })

  it('TEST: WebchatApp custom hostId', async () => {
    const webchatApp = new WebchatApp({ hostId: 'myCustomId' })
    expect(document.body.querySelector('#myCustomId')).toBeTruthy()
  })

  it('TEST: WebchatApp renders webchat', async () => {
    const webchatApp = new WebchatApp({})
    await act(async () => {
      const WebchatComponent = webchatApp.getComponent()
      render(WebchatComponent, webchatApp.getReactMountNode())
    })
    expectToHaveRoles([ROLES.TRIGGER_BUTTON], screen)
    expectNotToHaveRoles([ROLES.WEBCHAT], screen)
    const root = document.body.querySelector('#root')
    expect(root.shadowRoot).toBeFalsy()
  })

  it('TEST: WebchatApp renders webchat in shadowDOM', async () => {
    const webchatApp = new WebchatApp({ shadowDOM: true })
    await act(async () => {
      const WebchatComponent = webchatApp.getComponent()
      render(WebchatComponent, webchatApp.getReactMountNode())
    })
    expectToHaveRoles([ROLES.TRIGGER_BUTTON], screen)
    expectNotToHaveRoles([ROLES.WEBCHAT], screen)
    const root = document.body.querySelector('#root')
    expect(root.shadowRoot).toBeTruthy()

    // When building with Webpack we have a lot of styles in shadowRoot
    // but in this tests only styled-components styles will be present
    expect(root.shadowRoot.querySelectorAll('style').length > 0).toBeTruthy()
  })
})
