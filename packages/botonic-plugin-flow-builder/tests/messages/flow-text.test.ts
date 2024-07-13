import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../../src/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
import { basicFlow } from '../helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check the contents and logic of a text node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('The contents of the text message are displayed', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: { input: { data: 'flowText', type: INPUT.TEXT } },
    })

    const firstContent = contents[0] as FlowText
    expect(firstContent.text).toBe(
      'This text message contains buttons and replaces the variable {bagsAdded}'
    )

    const firstButton = firstContent.buttons[0]
    expect(firstButton.text).toEqual('Button to text')
    expect(firstButton.payload).toEqual('eb877738-3cf4-4a57-9f46-3122e18f1cc7')
    expect(firstButton.url).toBeUndefined()

    const secondButton = firstContent.buttons[1]
    expect(secondButton.text).toEqual('Button to url')
    expect(secondButton.url).toEqual('https://www.hubtype.com')
    expect(secondButton.payload).toBeUndefined()
  })

  test('The rendered message has the replaced bagsAdded variable to 2', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'flowText', type: INPUT.TEXT },
        extraData: { bagsAdded: 2 },
      },
    })

    const firstContent = contents[0] as FlowText
    // @ts-ignore
    const renderedMessage = firstContent.toBotonic(firstContent.id, request)
    expect(renderedMessage.props.children[0]).toBe(
      'This text message contains buttons and replaces the variable 2'
    )
  })
})
