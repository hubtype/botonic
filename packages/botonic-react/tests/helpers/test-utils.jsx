import TestRenderer from 'react-test-renderer'
import { RequestContext } from '../../src'
import { default as React } from 'react'
import { MultichannelContext } from '../../src/components/multichannel/multichannel-context'

/**
 *
 * @param node {React.ReactNode}
 * @param context to be merged into default RequestContext value
 */
export function withRequestContext(node, context = {}) {
  return (
    <RequestContext.Consumer>
      {value => (
        <MultichannelContext.Provider value={{ currentIndex: 1 }}>
          <RequestContext.Provider value={{ ...value, ...context }}>
            {node}
          </RequestContext.Provider>
        </MultichannelContext.Provider>
      )}
    </RequestContext.Consumer>
  )
}

export const whatsappRenderer = sut =>
  TestRenderer.create(
    withRequestContext(sut, { session: { user: { provider: 'whatsapp' } } })
  )
