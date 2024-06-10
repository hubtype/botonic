import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src'
import { ProcessEnvNodeEnvs } from '../src/types'
import { knowledgeBaseTestFlow } from './helpers/flows/knowledge-base'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the contents returned by the plugin when it use a knowledge base', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test('When the knowledge base answer is correct, (with knowledge and without hallucinations) the answer is used to display a knowledge base node', async () => {
    const userInput = 'What is Flow Builder?'
    const mockKnowledgeBaseResponse = jest.fn(() => {
      return Promise.resolve({
        inferenceId: 'inferenceId',
        question: userInput,
        answer:
          'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.',
        hasKnowledge: true,
        isFaithuful: true,
        sources: [
          {
            knowledgeBaseId: 'knowledgeBaseId',
            knowledgeSourceId: 'knowledgeSourceId',
            knowledgeChunkId: 'knowledgeChunkId',
          },
        ],
      })
    })

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        locale: 'es-ES',
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse,
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        extraData: {
          language: 'es',
          country: 'ES',
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe(
      'message Spain before knowledge response'
    )

    expect((contents[1] as FlowText).text).toBe(
      'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.'
    )
  })

  test('When the knowledge base flow does not end with a knowledge base node', async () => {
    const userInput = 'What is Flow Builder?'
    const mockKnowledgeBaseResponse = jest.fn(() => {
      return Promise.resolve({
        inferenceId: 'inferenceId',
        question: userInput,
        answer:
          'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.',
        hasKnowledge: true,
        isFaithuful: true,
        sources: [
          {
            knowledgeBaseId: 'knowledgeBaseId',
            knowledgeSourceId: 'knowledgeSourceId',
            knowledgeChunkId: 'knowledgeChunkId',
          },
        ],
      })
    })

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        locale: 'es-FR',
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse,
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        extraData: {
          language: 'es',
          country: 'FR',
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('message Other country')

    expect((contents[0] as FlowText).buttons.length).toBe(2)
  })

  test("When the knowledge base's response does not have sufficient knowledge, the fallback content is displayed.", async () => {
    const userInput = 'What is Flow Builder?'
    const mockKnowledgeBaseResponse = jest.fn(() => {
      return Promise.resolve({
        inferenceId: 'inferenceId',
        question: userInput,
        answer: 'This answer is incorrect',
        hasKnowledge: false,
        isFaithuful: true,
        sources: [
          {
            knowledgeBaseId: 'knowledgeBaseId',
            knowledgeSourceId: 'knowledgeSourceId',
            knowledgeChunkId: 'knowledgeChunkId',
          },
        ],
      })
    })

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        locale: 'es-ES',
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse,
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        extraData: {
          language: 'es',
          country: 'ES',
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('fallback 1')
  })
})
