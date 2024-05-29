import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create webview events', () => {
  const requestData = getRequestData()
  test('should webview step event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.WebviewStep,
      data: {
        webviewThreadId: '12345',
        webviewName: 'ADD_A_BAG',
        webviewStepName: 'step1',
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.WebviewStep,
          webview_thread_id: '12345',
          webview_name: 'ADD_A_BAG',
          webview_step_name: 'step1',
        },
        type: EventType.WebEvent,
      })
    )
  })

  test('should webview end event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.WebviewEnd,
      data: {
        webviewThreadId: '12345',
        webviewName: 'ADD_A_BAG',
        webviewEndFailType: 'canceled_by_user',
        webviewEndFailMessage: 'Closed by user',
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.WebviewEnd,
          webview_thread_id: '12345',
          webview_name: 'ADD_A_BAG',
          webview_end_fail_type: 'canceled_by_user',
          webview_end_fail_message: 'Closed by user',
        },
        type: EventType.WebEvent,
      })
    )
  })
})
