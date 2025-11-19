import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create fallback events (format v4)', () => {
  const requestData = getRequestData()

  test('Create fallback event with fallbackOut = 1 (first fallback)', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Fallback,
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      userInput: 'userInputTest',
      fallbackOut: 1,
      fallbackMessageId: 'fallbackMessageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      action: EventAction.Fallback,
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      user_input: 'userInputTest',
      fallback_out: 1,
      fallback_message_id: 'fallbackMessageIdTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('Create fallback event with fallbackOut = 2 (second fallback)', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Fallback,
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      userInput: 'userInputTest',
      fallbackOut: 2,
      fallbackMessageId: 'fallbackMessageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      action: EventAction.Fallback,
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      user_input: 'userInputTest',
      fallback_out: 2,
      fallback_message_id: 'fallbackMessageIdTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('Create fallback event with complete flow metadata', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.Fallback,
      flowId: 'flow-uuid-123',
      flowName: 'Customer Support Flow',
      flowNodeId: 'node-uuid-456',
      flowNodeContentId: 'FALLBACK_RESPONSE_1',
      userInput: 'I need help with something else',
      fallbackOut: 1,
      fallbackMessageId: 'msg-uuid-789',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      action: EventAction.Fallback,
      flow_id: 'flow-uuid-123',
      flow_name: 'Customer Support Flow',
      flow_node_id: 'node-uuid-456',
      flow_node_content_id: 'FALLBACK_RESPONSE_1',
      user_input: 'I need help with something else',
      fallback_out: 1,
      fallback_message_id: 'msg-uuid-789',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
