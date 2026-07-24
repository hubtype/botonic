import { INPUT } from '@botonic/core'
import { beforeEach, describe, expect, test } from '@jest/globals'

import type { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import {
  mockSmartIntent,
  smartIntentInferenceSpy,
} from './__mocks__/smart-intent'
import { smartIntentsFlow } from './helpers/flows/smart-intents'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check smart intent inference params', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('Passes inactive smart intent titles as disabled_smart_intent_titles to inference API', async () => {
    mockSmartIntent('Add a bag')

    await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: smartIntentsFlow },
      requestArgs: {
        input: {
          data: 'I want to add a bag to my flight booking',
          type: INPUT.TEXT,
        },
      },
    })

    expect(smartIntentInferenceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled_smart_intent_titles: ['Select a seat'],
      })
    )
  })

  test('Passes an empty disabled_smart_intent_titles list when smart intents have no is_active field', async () => {
    const flowWithLegacySmartIntents = {
      ...smartIntentsFlow,
      nodes: smartIntentsFlow.nodes.map(node =>
        node.type === 'smart-intent'
          ? {
              ...node,
              content: {
                title: node.content.title,
                description: node.content.description,
              },
            }
          : node
      ),
    }
    mockSmartIntent('Add a bag')

    await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: flowWithLegacySmartIntents },
      requestArgs: {
        input: {
          data: 'I want to add a bag to my flight booking',
          type: INPUT.TEXT,
        },
      },
    })

    expect(smartIntentInferenceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled_smart_intent_titles: [],
      })
    )
  })
})

describe('Check the contents returned by the plugin when match a smart intent', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    mockSmartIntent('Add a bag')
  })

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
    expect(request.input.nluResolution?.type).toEqual('smart-intent')
    expect(request.input.nluResolution?.matchedValue).toEqual('Add a bag')

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

describe('Check the contents returned when smart intent matches an AUDIO message with transcript', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    mockSmartIntent('Add a bag')
  })

  test('When the smart intent inference matches the transcript of an AUDIO message, the intent contents are displayed', async () => {
    const { contents, request, flowBuilderPluginPost } =
      await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: smartIntentsFlow },
        requestArgs: {
          input: {
            data: 'https://www.fake.com/audio.mp3',
            transcript: 'I want to add a bag to my flight booking',
            type: INPUT.AUDIO,
          },
        },
      })

    expect((contents[0] as FlowText).text).toBe(
      'Message explaining how to add a bag'
    )
    expect(request.input.nluResolution?.type).toEqual('smart-intent')
    expect(request.input.nluResolution?.matchedValue).toEqual('Add a bag')

    flowBuilderPluginPost({
      ...request,
      response: (contents[0] as FlowText).text,
    })
    expect(request.input.nluResolution).toEqual(undefined)
  })

  test('Smart intent is not triggered when AUDIO input has no transcript', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: smartIntentsFlow },
      requestArgs: {
        input: {
          data: 'https://www.fake.com/audio.mp3',
          type: INPUT.AUDIO,
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('fallback 1st message')
  })
})

describe('Check the contents returned by the plugin when no match a smart intent', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    mockSmartIntent('Other')
  })

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
