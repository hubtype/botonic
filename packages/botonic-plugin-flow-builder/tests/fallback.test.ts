import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import { basicFlow } from './helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the content returned by the plugin when there is no match with payload or keyword or intents', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))
  test('The content displayed changes between the 1st and 2nd fallback', async () => {
    const userInput = 'I want to cancel my flight'

    const firstFallback = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
      },
    })
    expect((firstFallback.contents[0] as FlowText).text).toBe(
      'fallback 1st message'
    )

    const secondFallback = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        extraData: firstFallback.request.session.user.extra_data,
      },
    })
    expect((secondFallback.contents[0] as FlowText).text).toBe(
      'fallback 2nd message'
    )

    const thirdFallback = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        extraData: secondFallback.request.session.user.extra_data,
      },
    })

    expect((thirdFallback.contents[0] as FlowText).text).toBe(
      'fallback 1st message'
    )
  })
})
