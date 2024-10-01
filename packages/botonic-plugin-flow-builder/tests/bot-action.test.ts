import { BotonicAction, INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createFlowBuilderPluginAndGetContents,
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

  test('The request.session._botonic_action have redirect:nextPayload', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          type: INPUT.POSTBACK,
          payload: botActionUuid,
        },
      },
    })

    expect(contents.length).toBe(1)
    expect(request.session._botonic_action).toBe(
      `${BotonicAction.Redirect}:${ratingPayloadWithParams}`
    )
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
