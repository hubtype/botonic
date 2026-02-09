import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import {
  FlowCountryConditional,
  FlowKnowledgeBase,
  type FlowText,
} from '../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockKnowledgeBaseResponse } from './__mocks__/knowledge-base'
import { knowledgeBaseTestFlow } from './helpers/flows/knowledge-base'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the contents returned by the plugin when it use a knowledge base', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  const userInput = 'What is Flow Builder?'
  const locale = 'es'
  const country = 'ES'
  const systemLocale = 'es'

  test('When the knowledge base answer is correct, (with knowledge and without hallucinations) the answer is used to display a knowledge base node', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse({
          answer:
            'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.',
          hasKnowledge: true,
          isFaithful: true,
        }),
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        user: {
          locale,
          country,
          systemLocale,
        },
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowCountryConditional)

    expect((contents[1] as FlowText).text).toBe(
      'message Spain before knowledge response'
    )
    expect(contents[2]).toBeInstanceOf(FlowKnowledgeBase)
    expect((contents[2] as FlowKnowledgeBase).text).toBe(
      'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.'
    )
    expect((contents[3] as FlowText).text).toBe('FollowUp Knowledge base')
  })

  test('Knowledge base response is not allowed when user is in handoff with shadowing', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse({
          answer:
            'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.',
          hasKnowledge: true,
          isFaithful: true,
        }),
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        user: {
          locale,
          country,
          systemLocale,
        },
        shadowing: true,
      },
    })

    expect((contents[0] as FlowText).text).toBe('fallback 1')
  })

  test('Knowledge base response is allowed if inShadowing.allowKnowledgeBases is true when user is in handoff with shadowing', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        inShadowing: { allowKnowledgeBases: true },
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse({
          answer:
            'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.',
          hasKnowledge: true,
          isFaithful: true,
        }),
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        user: {
          locale,
          country,
          systemLocale,
        },
        shadowing: true,
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowCountryConditional)
    expect((contents[1] as FlowText).text).toBe(
      'message Spain before knowledge response'
    )
    expect(contents[2]).toBeInstanceOf(FlowKnowledgeBase)
    expect((contents[2] as FlowKnowledgeBase).text).toBe(
      'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.'
    )
    expect((contents[3] as FlowText).text).toBe('FollowUp Knowledge base')
  })

  test('When the knowledge base flow does not end with a knowledge base node', async () => {
    const userInput = 'What is Flow Builder?'
    const answer =
      'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.'

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse({
          answer,
          hasKnowledge: true,
          isFaithful: true,
        }),
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        user: {
          locale: 'es',
          country: 'FR',
          systemLocale: 'es-FR',
        },
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowCountryConditional)
    expect((contents[1] as FlowText).text).toBe('message Other country')
    expect((contents[1] as FlowText).buttons.length).toBe(2)
  })

  test("When the knowledge base's response does not have sufficient knowledge, the fallback content is displayed.", async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse({
          answer: 'This answer is incorrect',
          hasKnowledge: false,
          isFaithful: true,
        }),
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        user: {
          locale,
          country,
          systemLocale,
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('fallback 1')
  })
})
