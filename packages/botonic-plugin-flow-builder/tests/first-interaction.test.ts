import { INPUT, type InferenceResponse, OutputMessageType } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowBuilderAction } from '../src/action/index'
import { FlowAiAgent, type FlowText } from '../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockAiAgentResponse } from './__mocks__/ai-agent'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import {
  aiAgentMainStartGoToFlowTestFlow,
  aiAgentTestFlow,
} from './helpers/flows/ai-agent'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createFlowBuilderPluginAndGetContents,
  createRequest,
  getActionRequest,
} from './helpers/utils'

describe('Check the contents returned by the plugin in first interaction', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))
  test('The start contents is displayed because user input no match with any keyword or intent', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'Hello', type: INPUT.TEXT },
        isFirstInteraction: true,
      },
    })

    expect((contents[1] as FlowText).text).toBe('Welcome message')
    expect((contents[2] as FlowText).text).toBe('How can I help you?')
    expect((contents[2] as FlowText).buttons.length).toBe(5)
  })

  test('The start contents is displayed because user input matches a keyword or intent that points to the first content', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'Hola', type: INPUT.TEXT },
        isFirstInteraction: true,
      },
    })

    expect((contents[1] as FlowText).text).toBe('Welcome message')
    expect(contents.length).toBe(3)
  })

  test('The start contents are displayed followed by more contents obtained by matching a keyword', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: { data: 'differentMessages', type: INPUT.TEXT },
        isFirstInteraction: true,
      },
    })

    expect((contents[1] as FlowText).text).toBe('Welcome message')
    expect(contents.length).toBe(4)
    expect((contents[3] as FlowText).text).toBe('All types of messages')
  })
})

describe('Execute botonicInit in the first interaction with contentID', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('plugin flow builder responds with the contents found by the contentID', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
    const request = createRequest({
      input: { data: 'hola', type: INPUT.TEXT },
      isFirstInteraction: true,
      plugins: {
        flowBuilderPlugin,
      },
    })
    await flowBuilderPlugin.pre(request)
    const actionRequest = getActionRequest(request)
    const contentID = 'MAIN_MENU'
    const { contents } = await FlowBuilderAction.botonicInit(
      actionRequest,
      contentID
    )

    expect(contents.length).toBe(1)
    expect((contents[0] as FlowText).text).toBe('How can I help you?')
    expect((contents[0] as FlowText).buttons.length).toBe(5)
    expect(request.session.flow_thread_id).toBeDefined()
  })

  test('plugin flow builder responds with the first interaction contents when not found contents by the contentID', async () => {
    const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
    const request = createRequest({
      input: { data: 'hola', type: INPUT.TEXT },
      isFirstInteraction: true,
      plugins: {
        flowBuilderPlugin,
      },
    })
    await flowBuilderPlugin.pre(request)
    const actionRequest = getActionRequest(request)
    const contentID = 'MAIN_MENU_2'
    const { contents } = await FlowBuilderAction.botonicInit(
      actionRequest,
      contentID
    )

    expect((contents[1] as FlowText).text).toBe('Welcome message')
    expect(contents.length).toBe(3)
  })
})

describe('Check the contents returned by the plugin in first interaction with smart intent', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('add_a_bag'))

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

    expect((contents[1] as FlowText).text).toBe('Welcome message')
    expect(contents.length).toBe(4)
    expect((contents[3] as FlowText).text).toBe(
      'Message explaining how to add a bag'
    )
  })
})

describe('Check the contents returned by the plugin in first interaction with AI agent disabled', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  const mockResponse: Partial<InferenceResponse> = {
    messages: [
      {
        type: OutputMessageType.Text,
        content: {
          text: 'AI agent response in first interaction',
        },
      },
    ],
  }

  test('When disableAIAgentInFirstInteraction is true, the AI agent is not called in first interaction', async () => {
    const aiAgentMock = mockAiAgentResponse(mockResponse)

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: aiAgentMock,
        disableAIAgentInFirstInteraction: true,
      },
      requestArgs: {
        input: {
          data: 'How can you help me?',
          type: INPUT.TEXT,
        },
        isFirstInteraction: true,
      },
    })

    expect(aiAgentMock).not.toHaveBeenCalled()
    expect((contents[0] as FlowText).text).toBe('Welcome')
    expect(contents.length).toBe(1)
  })

  test('When disableAIAgentInFirstInteraction is false (default), the AI agent responds in first interaction', async () => {
    const aiAgentMock = mockAiAgentResponse(mockResponse)

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: aiAgentMock,
        disableAIAgentInFirstInteraction: false,
      },
      requestArgs: {
        input: {
          data: 'How can you help me?',
          type: INPUT.TEXT,
        },
        isFirstInteraction: true,
      },
    })

    expect(aiAgentMock).toHaveBeenCalled()
    expect((contents[0] as FlowText).text).toBe('Welcome')
    expect(contents.length).toBe(2)
    expect((contents[1] as FlowAiAgent).messages[0]).toEqual({
      type: 'text',
      content: {
        text: 'AI agent response in first interaction',
      },
    })
  })

  test('When disableAIAgentInFirstInteraction is not set, the AI agent responds in first interaction by default', async () => {
    const aiAgentMock = mockAiAgentResponse(mockResponse)

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: aiAgentMock,
      },
      requestArgs: {
        input: {
          data: 'How can you help me?',
          type: INPUT.TEXT,
        },
        isFirstInteraction: true,
      },
    })

    expect(aiAgentMock).toHaveBeenCalled()
    expect((contents[0] as FlowText).text).toBe('Welcome')
    expect(contents.length).toBe(2)
  })

  test('When Main start is a go-to-flow to AI Agents, the AI agent responds once on first interaction', async () => {
    const aiAgentMock = mockAiAgentResponse(mockResponse)

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentMainStartGoToFlowTestFlow,
        getAiAgentResponse: aiAgentMock,
      },
      requestArgs: {
        input: {
          data: 'hola',
          type: INPUT.TEXT,
        },
        isFirstInteraction: true,
      },
    })

    const aiAgentContents = contents.filter(
      content => content instanceof FlowAiAgent
    )

    expect(aiAgentMock).toHaveBeenCalledTimes(1)
    expect(aiAgentContents).toHaveLength(1)
    expect((aiAgentContents[0] as FlowAiAgent).messages[0]).toEqual({
      type: 'text',
      content: {
        text: 'AI agent response in first interaction',
      },
    })
  })

  test('When disableAIAgentInFirstInteraction is true but it is not first interaction, the AI agent still responds', async () => {
    const aiAgentMock = mockAiAgentResponse(mockResponse)

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: aiAgentTestFlow,
        getAiAgentResponse: aiAgentMock,
        disableAIAgentInFirstInteraction: true,
      },
      requestArgs: {
        input: {
          data: 'How can you help me?',
          type: INPUT.TEXT,
        },
        isFirstInteraction: false,
      },
    })

    expect(aiAgentMock).toHaveBeenCalled()
    expect(contents.length).toBe(1)
    expect((contents[0] as FlowAiAgent).messages[0]).toEqual({
      type: 'text',
      content: {
        text: 'AI agent response in first interaction',
      },
    })
  })
})
