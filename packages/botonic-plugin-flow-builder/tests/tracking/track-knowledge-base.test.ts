import { INPUT } from '@botonic/core'

import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockKnowledgeBaseResponse, trackEventMock } from '../__mocks__'
import { knowledgeBaseTestFlow } from '../helpers/flows/knowledge-base'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Check tracked events when a bot generates a response using a knowledge base', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  const userInput = 'What is Flow Builder?'
  const language = 'es'
  const country = 'ES'
  const locale = `${language}-${country}`

  beforeEach(() => {
    trackEventMock.mockClear()
  })

  test('Track knowledgebase event', async () => {
    await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: knowledgeBaseTestFlow,
        locale,
        trackEvent: trackEventMock,
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

    expect(trackEventMock).toHaveBeenCalledTimes(3)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      'knowledgebase',
      {
        knowledgebaseInferenceId: 'inferenceId',
        knowledgebaseFailReason: undefined,
        knowledgebaseSourcesIds: ['sourceId1'],
        knowledgebaseChunksIds: ['sourceChunkId1', 'sourceChunkId2'],
        knowledgebaseMessageId: 'testMessageId',
        userInput: 'What is Flow Builder?',
        flowId: '4c8acc81-accd-529e-8bb6-d17f4cafafea',
        flowNodeId: 'b2ac9457-6928-41ea-9474-911133a75ff4',
        flowThreadId: 'testFlowThreadId',
      }
    )
  })
})
