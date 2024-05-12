import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from './helpers/utils'

describe('Check the content returned by the plugin when there is no match with payload or keyword or intents', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin(basicFlow)

  test('The content displayed changes between the 1st and 2nd fallback', async () => {
    const request = createRequest({
      input: { data: 'I want to cancel my flight', type: INPUT.TEXT },
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })

    const firstFallback = await getContentsAfterPreAndBotonicInit(
      request,
      flowBuilderPlugin
    )
    expect((firstFallback.contents[0] as FlowText).text).toBe(
      'fallback 1st message'
    )

    const secondFallback = await getContentsAfterPreAndBotonicInit(
      request,
      flowBuilderPlugin
    )
    expect((secondFallback.contents[0] as FlowText).text).toBe(
      'fallback 2nd message'
    )

    const thirdFallback = await getContentsAfterPreAndBotonicInit(
      request,
      flowBuilderPlugin
    )

    expect((thirdFallback.contents[0] as FlowText).text).toBe(
      'fallback 1st message'
    )
  })
})
