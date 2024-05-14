import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { BOT_ACTION_PAYLOAD_PREFIX } from '../src/constants'
import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from './helpers/utils'

describe('The user clicks on a button that is connected to a BotActionNode', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin(basicFlow)
  const ratingMessageUuid = '578b30eb-d230-4162-8a36-6c7fa18ff0db'
  const botActionUuid = '85dbeb56-81c9-419d-a235-4ebf491b4fc9'
  test('The button has  a payload equal to ba|botActionUuid', async () => {
    const request = createRequest({
      input: {
        type: INPUT.POSTBACK,
        payload: ratingMessageUuid,
      },
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })

    const { contents } = await getContentsAfterPreAndBotonicInit(
      request,
      flowBuilderPlugin
    )

    const nextPaylod = (contents[0] as FlowText).buttons[0].payload
    expect(nextPaylod).toBe(`${BOT_ACTION_PAYLOAD_PREFIX}${botActionUuid}`)
  })

  test('The bot routes receive the correct payload', async () => {
    const request = createRequest({
      input: {
        type: INPUT.POSTBACK,
        payload: `${BOT_ACTION_PAYLOAD_PREFIX}${botActionUuid}`,
      },
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })

    await flowBuilderPlugin.pre(request)
    expect(request.input.payload).toBe(
      'rating|{"value":1,"followUpContentID":"SORRY"}'
    )
  })

  test('In the custom action the payloadParmas defined in the BotActionNode are obtained', async () => {
    const request = createRequest({
      input: {
        type: INPUT.POSTBACK,
        payload: `${BOT_ACTION_PAYLOAD_PREFIX}${botActionUuid}`,
      },
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })

    await flowBuilderPlugin.pre(request)
    const payloadParams = flowBuilderPlugin.getPayloadParams(
      request.input.payload as string
    )
    expect(payloadParams).toEqual(
      JSON.parse('{"value":1,"followUpContentID":"SORRY"}')
    )
  })
})
