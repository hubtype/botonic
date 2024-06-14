import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import { basicFlow } from './helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the contents returned by the plugin in first interaction', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('The start contents is displayed because user input no match with any keyword or intent', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'Hello', type: INPUT.TEXT },
        isFirstInteraction: true,
      },
    })

    expect((contents[0] as FlowText).text).toBe('Welcome message')
    expect(contents.length).toBe(2)
  })

  test('The start contents is displayed because user input matches a keyword or intent that points to the first content', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'Hola', type: INPUT.TEXT },
        isFirstInteraction: true,
      },
    })

    expect((contents[0] as FlowText).text).toBe('Welcome message')
    expect(contents.length).toBe(2)
  })

  test('The start contents are displayed followed by more contents obtained by matching a keyword', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'differentMessages', type: INPUT.TEXT },
        isFirstInteraction: true,
      },
    })

    expect((contents[0] as FlowText).text).toBe('Welcome message')
    expect(contents.length).toBe(3)
    expect((contents[2] as FlowText).text).toBe('All types of messages')
  })

  test('The start contents are displayed followed by more contents obtained by matching an intent', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          data: 'I want to select my seat ',
          type: INPUT.TEXT,
          intent: 'select a seat',
          confidence: 0.8,
        },
        isFirstInteraction: true,
      },
    })

    expect((contents[0] as FlowText).text).toBe('Welcome message')
    expect(contents.length).toBe(3)
    expect((contents[2] as FlowText).text).toBe(
      'Message explaining how to select a seat'
    )
  })
})

describe('Check the contents returned by the plugin in first interaction with smart intent', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('add a bag'))

  test('The start contents are displayed followed by more contents obtained by matching a smart-intent', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          data: 'I want to add a bag to my booking',
          type: INPUT.TEXT,
        },
        isFirstInteraction: true,
      },
    })

    expect((contents[0] as FlowText).text).toBe('Welcome message')
    expect(contents.length).toBe(3)
    expect((contents[2] as FlowText).text).toBe(
      'Message explaining how to add a bag'
    )
  })
})
