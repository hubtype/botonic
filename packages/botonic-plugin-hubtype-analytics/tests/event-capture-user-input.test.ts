import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create capture user input events (format v5)', () => {
  const requestData = getRequestData()

  test('Create capture user input event with successful capture', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.CaptureUserInput,
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      flowThreadId: 'flowThreadIdTest',
      flowNodeIsMeaningful: true,
      fieldName: 'email',
      userInput: 'user@example.com',
      captureSuccess: true,
      messageId: 'messageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      action: EventAction.CaptureUserInput,
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      flow_thread_id: 'flowThreadIdTest',
      flow_node_is_meaningful: true,
      field_name: 'email',
      user_input: 'user@example.com',
      capture_success: true,
      message_id: 'messageIdTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('Create capture user input event with failed capture', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.CaptureUserInput,
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      flowThreadId: 'flowThreadIdTest',
      flowNodeIsMeaningful: false,
      fieldName: 'phone',
      userInput: 'not-a-phone',
      captureSuccess: false,
      messageId: 'messageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      action: EventAction.CaptureUserInput,
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      flow_thread_id: 'flowThreadIdTest',
      flow_node_is_meaningful: false,
      field_name: 'phone',
      user_input: 'not-a-phone',
      capture_success: false,
      message_id: 'messageIdTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('Create capture user input event with complete flow metadata', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.CaptureUserInput,
      flowId: 'flow-uuid-123',
      flowName: 'Customer Registration Flow',
      flowNodeId: 'node-uuid-456',
      flowNodeContentId: 'CAPTURE_EMAIL_INPUT',
      flowThreadId: 'thread-uuid-789',
      flowNodeIsMeaningful: true,
      fieldName: 'userEmail',
      userInput: 'customer@example.com',
      captureSuccess: true,
      messageId: 'messageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      action: EventAction.CaptureUserInput,
      flow_id: 'flow-uuid-123',
      flow_name: 'Customer Registration Flow',
      flow_node_id: 'node-uuid-456',
      flow_node_content_id: 'CAPTURE_EMAIL_INPUT',
      flow_thread_id: 'thread-uuid-789',
      flow_node_is_meaningful: true,
      field_name: 'userEmail',
      user_input: 'customer@example.com',
      capture_success: true,
      message_id: 'messageIdTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('Create capture user input event for numeric field', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.CaptureUserInput,
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      flowThreadId: 'flowThreadIdTest',
      flowNodeIsMeaningful: true,
      fieldName: 'age',
      userInput: '25',
      captureSuccess: true,
      messageId: 'messageIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      action: EventAction.CaptureUserInput,
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      flow_thread_id: 'flowThreadIdTest',
      flow_node_is_meaningful: true,
      field_name: 'age',
      user_input: '25',
      capture_success: true,
      message_id: 'messageIdTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
