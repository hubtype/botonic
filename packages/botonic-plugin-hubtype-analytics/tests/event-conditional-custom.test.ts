import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create conditional custom event', () => {
  test('should create conditional custom event', () => {
    const requestData = getRequestData()
    const htEvent = createHtEvent(requestData, {
      action: EventAction.ConditionalCustom,
      flowThreadId: 'flowThreadIdTest',
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      flowNodeIsMeaningful: false,
      conditionalVariable: 'customVariable',
      variableFormat: 'string',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      action: EventAction.ConditionalCustom,
      flow_thread_id: 'flowThreadIdTest',
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      flow_node_is_meaningful: false,
      conditional_variable: 'customVariable',
      variable_format: 'string',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
