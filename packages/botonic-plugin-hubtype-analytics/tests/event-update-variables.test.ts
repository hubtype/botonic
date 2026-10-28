import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create update variables event', () => {
  test('should create update variables event with path and values', () => {
    const requestData = getRequestData()
    const setVariables = {
      'session.user.name': 'Ada',
      'session.user.contact_info.email': 'a@b.com',
      'session.customFlag': true,
      'session.nested.value': 42,
    }
    const htEvent = createHtEvent(requestData, {
      action: EventAction.UpdateVariables,
      flowThreadId: 'flowThreadIdTest',
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      flowNodeIsMeaningful: true,
      setVariables,
      unsetVariables: ['session.user.phone'],
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 6,
      action: EventAction.UpdateVariables,
      flow_thread_id: 'flowThreadIdTest',
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      flow_node_is_meaningful: true,
      set_variables: setVariables,
      unset_variables: ['session.user.phone'],
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })
})
