import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create handoff events', () => {
  const requestData = getRequestData()
  test('should create handoff success event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.HandoffSuccess,
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      queueId: 'handoffQueueIdTest',
      queueName: 'handoffQueueNameTest',
      caseId: 'handoffCaseIdTest',
      isQueueOpen: true,
      isAvailableAgent: true,
      isThresholdReached: false,
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 4,
      action: EventAction.HandoffSuccess,
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
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
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      queueId: 'handoffQueueIdTest',
      queueName: 'handoffQueueNameTest',
      isQueueOpen: false,
      isAvailableAgent: false,
      isThresholdReached: false,
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 4,
      action: EventAction.HandoffFail,
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
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
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      queueId: 'handoffQueueIdTest',
      queueName: 'handoffQueueNameTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 4,
      action: EventAction.HandoffOption,
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      handoff_queue_id: 'handoffQueueIdTest',
      handoff_queue_name: 'handoffQueueNameTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('should create handoff option event, without params', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.HandoffOption,
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 4,
      action: EventAction.HandoffOption,
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
