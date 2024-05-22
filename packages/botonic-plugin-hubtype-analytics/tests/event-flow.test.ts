import { createHtEvent, EventType, FlowAction } from '../src'
import { getRequestData } from './helpers'

describe('Create flow event', () => {
  test('should create flow event', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      action: FlowAction.flowNode,
      data: {
        flowThreadId: 'flowThreadIdTest',
        flowId: 'flowIdTest',
        flowName: 'flowNameTest',
        flowNodeId: 'flowNodeIdTest',
        flowNodeContentId: 'flowNodeContentIdTest',
        flowNodeIsMeaningful: undefined,
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
          action: FlowAction.flowNode,
          flow_thread_id: 'flowThreadIdTest',
          flow_id: 'flowIdTest',
          flow_name: 'flowNameTest',
          flow_node_id: 'flowNodeIdTest',
          flow_node_content_id: 'flowNodeContentIdTest',
          flow_node_is_meaningful: false,
        },
        type: EventType.flow,
      })
    )
  })
})