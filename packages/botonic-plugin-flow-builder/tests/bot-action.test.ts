import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { BOT_ACTION_PAYLOAD_SEPARATOR } from '../src/constants'
import { FlowBuilderAction, FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { testFlow } from './helpers/flows'
import {
  createFlowBuilderPlugin,
  createRequest,
  getActionRequest,
} from './helpers/utils'

describe('Check the contents returned by the plugin', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin(testFlow)

  test('The user does the first interaction', async () => {
    const request = createRequest({
      input: { data: 'Hola', type: INPUT.TEXT },
      isFirstInteraction: true,
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })
    await flowBuilderPlugin.pre(request)
    const actionRequest = getActionRequest(request)
    const { contents } = await FlowBuilderAction.botonicInit(actionRequest)

    expect((contents[0] as FlowText).text).toBe('Welcome message')
  })
})

describe('The user clicks on a button that is connected to a BotActionNode', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin(testFlow)
  const messageUUidWithButtonConectedToBotAction =
    '386ba508-a3b3-49a2-94d0-5e239ba63106'
  const botActionUuid = '8b0c87c0-77b2-4b05-bae0-3b353240caaa'
  test('The button has the payload = ba|botActionUuid', async () => {
    const request = createRequest({
      input: {
        type: INPUT.POSTBACK,
        payload: messageUUidWithButtonConectedToBotAction,
      },
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })
    await flowBuilderPlugin.pre(request)
    const actionRequest = getActionRequest(request)
    const { contents } = await FlowBuilderAction.botonicInit(actionRequest)
    const nextPaylod = (contents[0] as FlowText).buttons[0].payload
    expect(nextPaylod).toBe(`${BOT_ACTION_PAYLOAD_SEPARATOR}${botActionUuid}`)
  })

  test('The bot routes receive the correct payload, in the custom action the payloadParmas defined in the BotActionNode are obtained', async () => {
    const request = createRequest({
      input: {
        type: INPUT.POSTBACK,
        payload: `${BOT_ACTION_PAYLOAD_SEPARATOR}${botActionUuid}`,
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

    const payloadParams = flowBuilderPlugin.getPayloadParams(
      request.input.payload as string
    )
    expect(payloadParams).toEqual(
      JSON.parse('{"value":1,"followUpContentID":"SORRY"}')
    )
  })
})
