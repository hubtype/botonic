import {
  createHtEvent,
  EventAction,
  EventType,
  WebviewEndFailType,
} from '../src'
import { getRequestData } from './helpers'

describe('Create webview events', () => {
  const requestData = getRequestData()
  test('should create webview action triggered event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.WebviewActionTriggered,
      flowThreadId: 'flowThreadIdTest',
      flowId: 'flowIdTest',
      flowName: 'flowNameTest',
      flowNodeId: 'flowNodeIdTest',
      flowNodeContentId: 'flowNodeContentIdTest',
      webviewTargetId: 'webviewTargetIdTest',
      webviewName: 'ADD_A_BAG',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 5,
      action: EventAction.WebviewActionTriggered,
      flow_thread_id: 'flowThreadIdTest',
      flow_id: 'flowIdTest',
      flow_name: 'flowNameTest',
      flow_node_id: 'flowNodeIdTest',
      flow_node_content_id: 'flowNodeContentIdTest',
      webview_target_id: 'webviewTargetIdTest',
      webview_name: 'ADD_A_BAG',
      bot_interaction_id: 'testInteractionId',
      type: EventType.BotEvent,
    })
  })

  test('should webview step event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.WebviewStep,
      webviewThreadId: '12345',
      webviewName: 'ADD_A_BAG',
      webviewStepName: 'step1',
      webviewStepNumber: 1,
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 4,
      action: EventAction.WebviewStep,
      webview_thread_id: '12345',
      webview_name: 'ADD_A_BAG',
      webview_step_name: 'step1',
      webview_step_n: 1,
      type: EventType.WebEvent,
      bot_interaction_id: 'testInteractionId',
    })
  })

  test('should webview end event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.WebviewEnd,
      webviewThreadId: '12345',
      webviewName: 'ADD_A_BAG',
      webviewStepName: 'summary_step',
      webviewStepNumber: 3,
      webviewEndFailType: WebviewEndFailType.CanceledByUser,
      webviewEndFailMessage: 'Closed by user',
    })

    expect(htEvent).toEqual({
      chat_id: 'chatIdTest',
      user_locale: 'es',
      user_country: 'ES',
      system_locale: 'es',
      format_version: 4,
      action: EventAction.WebviewEnd,
      webview_thread_id: '12345',
      webview_name: 'ADD_A_BAG',
      webview_end_step_name: 'summary_step',
      webview_end_step_n: 3,
      webview_end_fail_type: WebviewEndFailType.CanceledByUser,
      webview_end_fail_message: 'Closed by user',
      type: EventType.WebEvent,
      bot_interaction_id: 'testInteractionId',
    })
  })
})
