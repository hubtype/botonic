import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockQueueAvailability } from './__mocks__/conditional-queue'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from './helpers/utils'

describe('Check the content returned by the plugin, when the queue is open', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })

  beforeEach(() => mockQueueAvailability({ isOpen: true, name: 'General' }))

  test('The content connected to the status queue open is displayed and a handoff is done', async () => {
    const request = createRequest({
      input: { data: 'agent', type: INPUT.TEXT },
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })

    const { contents } = await getContentsAfterPreAndBotonicInit(
      request,
      flowBuilderPlugin
    )

    expect((contents[0] as FlowText).text).toBe(
      'Soon you will be served by a human agent'
    )
    expect(request.session._botonic_action).toBeDefined()
  })
})

describe('The content connected to the closed queue status is displayed and the handoff is not done', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })

  beforeEach(() => mockQueueAvailability({ isOpen: false, name: 'General' }))

  test('The content connected to the node before the handoff node is displayed and a handoff is done.', async () => {
    const request = createRequest({
      input: { data: 'agent', type: INPUT.TEXT },
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })

    const { contents } = await getContentsAfterPreAndBotonicInit(
      request,
      flowBuilderPlugin
    )

    expect((contents[0] as FlowText).text).toBe(
      'At the moment we are out of office hours'
    )
    expect(request.session._botonic_action).toBeUndefined()
  })
})
