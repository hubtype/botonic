import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createFlowBuilderPluginAndGetContents,
  createRequest,
} from './helpers/utils'

describe('The user clicks on a button that is connected to a BotActionNode', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
  const ratingMessageUuid = '578b30eb-d230-4162-8a36-6c7fa18ff0db'
  const botActionUuid = '85dbeb56-81c9-419d-a235-4ebf491b4fc9'
  const ratingPayload = 'rating'
  const payloadParms = '{"value":1,"followUpContentID":"SORRY"}'
  const ratingPayloadWithParams = `${ratingPayload}|${payloadParms}`

  test('The button has a payload equal to botActionUuid', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          type: INPUT.POSTBACK,
          payload: ratingMessageUuid,
        },
      },
    })

    const nextPaylod = (contents[0] as FlowText).buttons[0].payload
    expect(nextPaylod).toBe(botActionUuid)
  })

  test('When the request.input.payload is a UUID of a bot action node it is replaced by the payload with parameters defined in the node', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({
      flow: basicFlow,
    })

    const requestArgs = {
      input: {
        type: INPUT.POSTBACK,
        payload: botActionUuid,
      },
    }

    const request = createRequest({
      ...requestArgs,
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })
    await flowBuilderPlugin.pre(request)

    expect(request.input.payload).toBe(ratingPayloadWithParams)
  })

  test('In the custom action the payloadParmas defined in the BotActionNode are obtained', async () => {
    const payloadParams = flowBuilderPlugin.getPayloadParams(
      ratingPayloadWithParams
    )
    expect(payloadParams).toEqual(
      JSON.parse('{"value":1,"followUpContentID":"SORRY"}')
    )
  })
})
