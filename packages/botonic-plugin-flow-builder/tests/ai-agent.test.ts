import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockAiAgentResponse } from './__mocks__/ai-agent'
import { aiAgentTestFlow } from './helpers/flows/ai-agent'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the contents returned by the plugin when it use an ai agent', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test.skip('When input match a keyword, the ai agent not respond', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: mockAiAgentResponse({
          message: {
            role: 'assistant',
            content: 'Ai agent response',
          },
        }),
      },
      requestArgs: {
        input: {
          data: 'Hello',
          type: INPUT.TEXT,
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('keywords trigger')
    expect(request.input.nluResolution?.type).toEqual('keyword')
    expect(request.input.nluResolution?.matchedValue).toEqual('Hello')
  })

  test.skip('When input not match a keyword or smart intent, the ai agent respond', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: mockAiAgentResponse({
          message: {
            role: 'assistant',
            content:
              'I can provide you with information about current temperatures, forecasts, and the probability of rain for your location. Just let me know where you are or where you’re interested in, and I’ll give you the details!',
          },
        }),
      },
      requestArgs: {
        input: {
          data: 'How can you help me?',
          type: INPUT.TEXT,
        },
      },
    })

    expect((contents[0] as FlowText).text).toEqual(
      'I can provide you with information about current temperatures, forecasts, and the probability of rain for your location. Just let me know where you are or where you’re interested in, and I’ll give you the details!'
    )
  })
})
