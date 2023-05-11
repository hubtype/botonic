import { act, screen } from '@testing-library/react'

import { ROLES } from '../../lib/cjs/constants'
import { DevApp } from '../../lib/cjs/dev-app'
import { expectNotToHaveRoles, expectToHaveRoles } from '../helpers/test-utils'

describe('TEST: Dev App', () => {
  // https://stackoverflow.com/questions/42805128/does-jest-reset-the-jsdom-document-after-every-suite-or-test
  afterEach(() => {
    document.getElementsByTagName('body')[0].innerHTML = ''
  })

  // To avoid TypeError: frame.scrollTo is not a function
  window.HTMLElement.prototype.scrollTo = function () {}

  it('TEST: DevApp renders webchat and debug tab', async () => {
    const devApp = new DevApp({ routes: [] })
    await act(async () => {
      devApp.render()
    })
    expectToHaveRoles([ROLES.TRIGGER_BUTTON], screen)
    expectNotToHaveRoles([ROLES.WEBCHAT], screen)
    expect(screen.getByText(/Botonic Dev Console/i)).toBeTruthy()
  })
})
