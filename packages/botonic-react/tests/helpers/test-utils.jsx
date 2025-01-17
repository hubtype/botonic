import { renderHook } from '@testing-library/react'
import * as React from 'react'
import TestRenderer from 'react-test-renderer'

import { MultichannelContext } from '../../src/components/multichannel/multichannel-context'
import { RequestContext } from '../../src/contexts'
import { useWebchat } from '../../src/webchat/context/use-webchat'

/**
 *
 * @param node {React.ReactNode}
 * @param context to be merged into default RequestContext value
 */
export function withRequestContext(
  node,
  context = {},
  multichannelContext = {}
) {
  return (
    <RequestContext.Consumer>
      {value => (
        <MultichannelContext.Provider
          value={{ currentIndex: 1, ...multichannelContext }}
        >
          <RequestContext.Provider value={{ ...value, ...context }}>
            {node}
          </RequestContext.Provider>
        </MultichannelContext.Provider>
      )}
    </RequestContext.Consumer>
  )
}

export const whatsappRenderer = (sut, multichannelContext = {}) =>
  TestRenderer.create(
    withRequestContext(
      sut,
      { session: { user: { provider: 'whatsapp' } } },
      multichannelContext
    )
  )

export const renderCustomHook = hook => renderHook(() => hook())
export const renderUseWebchatHook = () => renderCustomHook(useWebchat)

export const toMB = size => size * 1024 * 1024
export const createFile = ({ fakeData, fileName, mimeType, size }) => {
  const file = new File([fakeData], fileName, { type: mimeType })
  if (size) {
    // https://stackoverflow.com/a/55638956
    Object.defineProperty(file, 'size', {
      value: size,
      writable: false,
    })
  }
  return file
}

export function expectToHaveRoles(roles, screen) {
  roles.forEach(r => {
    expect(screen.queryByRole(r)).toBeTruthy()
  })
}

export function expectNotToHaveRoles(roles, screen) {
  roles.forEach(r => {
    expect(screen.queryByRole(r)).toBeNull()
  })
}
