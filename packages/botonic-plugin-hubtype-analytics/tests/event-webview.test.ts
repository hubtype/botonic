import {
  createHtEvent,
  EventAction,
  EventType,
  WebviewEndFailType,
} from '../src'
import { getRequestData } from './helpers'

describe('Create webview events', () => {
  const requestData = getRequestData()
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
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
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
      chat_language: 'es',
      chat_country: 'ES',
      format_version: 2,
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
