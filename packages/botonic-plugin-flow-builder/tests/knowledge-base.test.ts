import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockKnowledgeBaseResponse } from './__mocks__/knowledge-base'
import { knowledgeBaseTestFlow } from './helpers/flows/knowledge-base'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the contents returned by the plugin when it use a knowledge base', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  const userInput = 'What is Flow Builder?'
  const language = 'es'
  const country = 'ES'
  const locale = `${language}-${country}`

  test('When the knowledge base answer is correct, (with knowledge and without hallucinations) the answer is used to display a knowledge base node', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        locale,
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse({
          userInput,
          answer:
            'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.',
          hasKnowledge: true,
          isFaithuful: true,
        }),
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        extraData: {
          language,
          country,
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
    const answer =
      'Flow Builder is a visual tool used to create and manage Conversational Apps. It allows users to design conversational flows by dragging and dropping elements, connecting them, and adding content to create conversational experiences. The tool is designed to enable non-technical users to create and manage Conversational Apps autonomously.'

    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        locale: 'es-FR',
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse({
          userInput,
          answer,
          hasKnowledge: true,
          isFaithuful: true,
        }),
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
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        locale,
        getKnowledgeBaseResponse: mockKnowledgeBaseResponse({
          userInput,
          answer: 'This answer is incorrect',
          hasKnowledge: false,
          isFaithuful: true,
        }),
      },
      requestArgs: {
        input: {
          data: userInput,
          type: INPUT.TEXT,
        },
        extraData: {
          language,
          country,
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('fallback 1')
  })
})
