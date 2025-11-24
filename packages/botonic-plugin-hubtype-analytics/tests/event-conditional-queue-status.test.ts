import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create conditional queue status event', () => {
  test('should create conditional queue status event', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      action: EventAction.ConditionalQueueStatus,
      flowThreadId: 'flowThreadIdTest',
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      flowNodeIsMeaningful: false,
      queueId: 'queueIdTest',
      queueName: 'queueNameTest',
      isQueueOpen: true,
      isAvailableAgent: false,
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      action: EventAction.ConditionalQueueStatus,
      flow_thread_id: 'flowThreadIdTest',
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      flow_node_is_meaningful: false,
      queue_id: 'queueIdTest',
      queue_name: 'queueNameTest',
      is_queue_open: true,
      is_available_agent: false,
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
