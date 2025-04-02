import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import { smartIntentsFlow } from './helpers/flows/smart-intents'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the contents returned by the plugin when match a smart intent', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Add a bag'))

  test('When the smart intent inference returns the intent_name Add a bag, the contents of the add a bag use case are displayed', async () => {
    const { contents, request, flowBuilderPluginPost } =
      await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: smartIntentsFlow },
        requestArgs: {
          input: {
            data: 'I want to add a bag to my flight booking',
            type: INPUT.TEXT,
          },
        },
      })

    expect((contents[0] as FlowText).text).toBe(
      'Message explaining how to add a bag'
    )
    expect(request.input.nluResolution).toEqual({
      type: 'smart-intent',
      matchedValue: 'Add a bag',
    })

    flowBuilderPluginPost({
      ...request,
      response: (contents[0] as FlowText).text,
    })
    expect(request.input.nluResolution).toEqual(undefined)
  })

  test('Smart intent is not allowed by default when user is in handoff with shadowing', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: smartIntentsFlow,
      },
      requestArgs: {
        input: {
          data: 'I want to add a bag to my flight booking',
          type: INPUT.TEXT,
        },
        shadowing: true,
      },
    })

    expect((contents[0] as FlowText).text).toBe('fallback 1st message')
    expect(request.input.nluResolution).toEqual(undefined)
  })

  test('Smart intent is allowed if inShadowing.allowSmartIntents is true when user is in handoff with shadowing', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: smartIntentsFlow,
        inShadowing: { allowSmartIntents: true },
      },
      requestArgs: {
        input: {
          data: 'I want to add a bag to my flight booking',
          type: INPUT.TEXT,
        },
        shadowing: true,
      },
    })

    expect((contents[0] as FlowText).text).toBe(
      'Message explaining how to add a bag'
    )
    expect(request.input.nluResolution?.type).toEqual('smart-intent')
    expect(request.input.nluResolution?.matchedValue).toEqual('Add a bag')
  })
})

describe('Check the contents returned by the plugin when no match a smart intent', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))

  test('When the smart intent inference returns the intent_name Other, fallback content are displayed', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: smartIntentsFlow },
      requestArgs: {
        input: {
          data: 'I want to cancel my booking',
          type: INPUT.TEXT,
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('fallback 1st message')
    expect(request.input.nluResolution).toEqual(undefined)
  })
})
