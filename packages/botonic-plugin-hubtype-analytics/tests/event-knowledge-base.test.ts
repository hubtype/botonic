import {
  createHtEvent,
  EventAction,
  EventType,
  KnowledgebaseFailReason,
} from '../src'
import { getRequestData } from './helpers'

describe('Create knowledge base events', () => {
  const requestData = getRequestData()
  test('The knowledge base is working correctly and the event has all the fields mens the knowledgebaseFailReason', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Knowledgebase,
      knowledgebaseInferenceId: 'knowledgebaseInferenceId',
      knowledgebaseSourcesIds: ['sourceId1', 'sourceId2'],
      knowledgebaseChunksIds: ['cunkId1', 'chunkId2', 'chunkId3'],
      knowledgebaseMessageId: 'knowledgebaseMessageId',
      userInput: 'What is Flow Builder?',
      flowThreadId: 'flowThreadId',
      flowId: 'flowId',
      flowNodeId: 'knowledgebaseNodeId',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.Knowledgebase,
      knowledgebase_inference_id: 'knowledgebaseInferenceId',
      knowledgebase_sources_ids: ['sourceId1', 'sourceId2'],
      knowledgebase_chunks_ids: ['cunkId1', 'chunkId2', 'chunkId3'],
      knowledgebase_message_id: 'knowledgebaseMessageId',
      user_input: 'What is Flow Builder?',
      flow_thread_id: 'flowThreadId',
      flow_id: 'flowId',
      flow_node_id: 'knowledgebaseNodeId',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('The knowledge base is not working properly and the error has a hallucination', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Knowledgebase,
      knowledgebaseInferenceId: 'knowledgebaseInferenceId',
      knowledgebaseFailReason: KnowledgebaseFailReason.Hallucination,
      knowledgebaseSourcesIds: ['sourceId1', 'sourceId2'],
      knowledgebaseChunksIds: ['cunkId1', 'chunkId2', 'chunkId3'],
      knowledgebaseMessageId: 'knowledgebaseMessageId',
      userInput: 'What is Flow Builder?',
      flowThreadId: 'flowThreadId',
      flowId: 'flowId',
      flowNodeId: 'knowledgebaseNodeId',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.Knowledgebase,
      knowledgebase_inference_id: 'knowledgebaseInferenceId',
      knowledgebase_fail_reason: KnowledgebaseFailReason.Hallucination,
      knowledgebase_sources_ids: ['sourceId1', 'sourceId2'],
      knowledgebase_chunks_ids: ['cunkId1', 'chunkId2', 'chunkId3'],
      knowledgebase_message_id: 'knowledgebaseMessageId',
      user_input: 'What is Flow Builder?',
      flow_thread_id: 'flowThreadId',
      flow_id: 'flowId',
      flow_node_id: 'knowledgebaseNodeId',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
