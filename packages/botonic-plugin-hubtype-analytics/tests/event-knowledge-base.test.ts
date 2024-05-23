import { createHtEvent, EventType, KnowledgeBaseAction } from '../src'
import { getRequestData } from './helpers'

describe('Create knowledge base events', () => {
  const requestData = getRequestData()
  test('should create knowledge base event', () => {
    const htEvent = createHtEvent(requestData, {
      action: KnowledgeBaseAction.knowledgebase,
      data: {
        knowledgebaseId: 'knowledgebaseId',
        knowledgebaseFailReason: 'knowledgebaseFailReason',
        knowledgebaseSourcesIds: ['sourceId1', 'sourceId2'],
        knowledgebaseChunksIds: ['cunkId1', 'chunkId2', 'chunkId3'],
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
          action: KnowledgeBaseAction.knowledgebase,
          knowledgebase_id: 'knowledgebaseId',
          knowledgebase_fail_reason: 'knowledgebaseFailReason',
          knowledgebase_sources_ids: ['sourceId1', 'sourceId2'],
          knowledgebase_chunks_ids: ['cunkId1', 'chunkId2', 'chunkId3'],
        },
        type: EventType.flow,
      })
    )
  })
})
