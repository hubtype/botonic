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
      action: EventAction.knowledgebase,
      data: {
        knowlaedgebaseInferenceId: 'knowlaedgebaseInferenceId',
        knowledgebaseSourcesIds: ['sourceId1', 'sourceId2'],
        knowledgebaseChunksIds: ['cunkId1', 'chunkId2', 'chunkId3'],
        knowledgebaseMessageId: 'knowledgebaseMessageId',
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        channel: 'webchat',
        created_at: htEvent.created_at,
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.knowledgebase,
          knowlaedgebase_inference_id: 'knowlaedgebaseInferenceId',
          knowledgebase_sources_ids: ['sourceId1', 'sourceId2'],
          knowledgebase_chunks_ids: ['cunkId1', 'chunkId2', 'chunkId3'],
          knowledgebase_message_id: 'knowledgebaseMessageId',
        },
        type: EventType.botevent,
      })
    )
  })

  test('The knowledge base is not working properly and the error has a hallucination', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.knowledgebase,
      data: {
        knowlaedgebaseInferenceId: 'knowlaedgebaseInferenceId',
        knowledgebaseFailReason: KnowledgebaseFailReason.hallucination,
        knowledgebaseSourcesIds: ['sourceId1', 'sourceId2'],
        knowledgebaseChunksIds: ['cunkId1', 'chunkId2', 'chunkId3'],
        knowledgebaseMessageId: 'knowledgebaseMessageId',
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        channel: 'webchat',
        created_at: htEvent.created_at,
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.knowledgebase,
          knowlaedgebase_inference_id: 'knowlaedgebaseInferenceId',
          knowledgebase_fail_reason: KnowledgebaseFailReason.hallucination,
          knowledgebase_sources_ids: ['sourceId1', 'sourceId2'],
          knowledgebase_chunks_ids: ['cunkId1', 'chunkId2', 'chunkId3'],
          knowledgebase_message_id: 'knowledgebaseMessageId',
        },
        type: EventType.botevent,
      })
    )
  })
})
