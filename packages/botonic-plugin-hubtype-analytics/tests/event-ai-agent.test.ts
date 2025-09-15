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
      toolsExecuted: ['tool1', 'tool2'],
      memoryLength: 0,
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
      format_version: 3,
      bot_interaction_id: 'testInteractionId',
      flow_thread_id: 'flowThreadIdTest',
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      flow_node_is_meaningful: true,
      tools_executed: ['tool1', 'tool2'],
      memory_length: 0,
      input_guardrails_triggered: [],
      output_guardrails_triggered: [],
      exit: false,
      error: false,
      input_message_id: 'messageIdTest',
    })
  })
})
