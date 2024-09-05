import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create handoff events', () => {
  const requestData = getRequestData()
  test('should create handoff success event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.HandoffSuccess,
      queueId: 'handoffQueueIdTest',
      queueName: 'handoffQueueNameTest',
      caseId: 'handoffCaseIdTest',
      isQueueOpen: true,
      isAvailableAgent: true,
      isThresholdReached: false,
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.HandoffSuccess,
      handoff_queue_id: 'handoffQueueIdTest',
      handoff_queue_name: 'handoffQueueNameTest',
      handoff_case_id: 'handoffCaseIdTest',
      handoff_is_queue_open: true,
      handoff_is_available_agent: true,
      handoff_is_threshold_reached: false,
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('should create handoff fail event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.HandoffFail,
      queueId: 'handoffQueueIdTest',
      queueName: 'handoffQueueNameTest',
      isQueueOpen: false,
      isAvailableAgent: false,
      isThresholdReached: false,
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.HandoffFail,
      handoff_queue_id: 'handoffQueueIdTest',
      handoff_queue_name: 'handoffQueueNameTest',
      handoff_is_queue_open: false,
      handoff_is_available_agent: false,
      handoff_is_threshold_reached: false,
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('should create handoff option event, with all params', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.HandoffOption,
      queueId: 'handoffQueueIdTest',
      queueName: 'handoffQueueNameTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.HandoffOption,
      handoff_queue_id: 'handoffQueueIdTest',
      handoff_queue_name: 'handoffQueueNameTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('should create handoff option event, without params', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.HandoffOption,
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.HandoffOption,
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
