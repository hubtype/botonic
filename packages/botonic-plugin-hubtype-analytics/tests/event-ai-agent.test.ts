import { EventAction, EventType } from '../src/types'
import { createHtEvent } from '../src/utils'
import { getRequestData } from './helpers/index'

describe('Ai agent event', () => {
  const requestData = getRequestData()
  test('Create an ai agent event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.AiAgent,
      flowThreadId: 'flowThreadIdTest',
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      flowNodeIsMeaningful: true,
      toolsExecuted: [
        {
          toolName: 'retrieve_knowledge',
          toolArguments: { query: 'value1' },
          knowledgebaseSourcesIds: ['105c2045-1968-4e37-bb2c-b9a3647b1bda'],
          knowledgebaseChunksIds: ['106c2045-1968-4e37-bb2c-b9a3647b1bda'],
        },
        { toolName: 'tool2', toolArguments: { arg2: 'value2' } },
      ],
      memoryLength: 4,
      inputMessageId: 'messageIdTest',
      inputGuardrailsTriggered: [],
      outputGuardrailsTriggered: [],
      exit: false,
      error: false,
    })

    expect(htEvent).toEqual({
      type: EventType.BotEvent,
      action: EventAction.AiAgent,
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      bot_interaction_id: 'testInteractionId',
      flow_thread_id: 'flowThreadIdTest',
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      flow_node_is_meaningful: true,
      tools_executed: [
        {
          tool_name: 'retrieve_knowledge',
          tool_arguments: { query: 'value1' },
          knowledgebase_sources_ids: ['105c2045-1968-4e37-bb2c-b9a3647b1bda'],
          knowledgebase_chunks_ids: ['106c2045-1968-4e37-bb2c-b9a3647b1bda'],
        },
        { tool_name: 'tool2', tool_arguments: { arg2: 'value2' } },
      ],
      memory_length: 4,
      input_guardrails_triggered: [],
      output_guardrails_triggered: [],
      exit: false,
      error: false,
      input_message_id: 'messageIdTest',
    })
  })
})
