import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create flow event', () => {
  test('should create flow event', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      action: EventAction.FlowNode,
      flowThreadId: 'flowThreadIdTest',
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      flowNodeIsMeaningful: undefined,
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
      action: EventAction.FlowNode,
      flow_thread_id: 'flowThreadIdTest',
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      flow_node_is_meaningful: false,
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
