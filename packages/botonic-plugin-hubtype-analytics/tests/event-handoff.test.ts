import { createHtEvent, EventAction, EventType } from '../src'
import { getRequestData } from './helpers'

describe('Create handoff events', () => {
  const requestData = getRequestData()
  test('should create handoff success event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.handoffSuccess,
      data: {
        queueId: 'handoffQueueIdTest',
        queueName: 'handoffQueueNameTest',
        caseId: 'handoffCaseIdTest',
        isQueueOpen: true,
        isAvailableAgent: true,
        isThresholdReached: false,
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.handoffSuccess,
          handoff_queue_id: 'handoffQueueIdTest',
          handoff_queue_name: 'handoffQueueNameTest',
          handoff_case_id: 'handoffCaseIdTest',
          is_queue_open: true,
          handoff_is_available_agent: true,
          handoff_is_threshold_reached: false,
        },
        type: EventType.botevent,
      })
    )
  })

  test('should create handoff fail event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.handoffFail,
      data: {
        queueId: 'handoffQueueIdTest',
        queueName: 'handoffQueueNameTest',
        isQueueOpen: false,
        isAvailableAgent: false,
        isThresholdReached: false,
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.handoffFail,
          handoff_queue_id: 'handoffQueueIdTest',
          handoff_queue_name: 'handoffQueueNameTest',
          is_queue_open: false,
          handoff_is_available_agent: false,
          handoff_is_threshold_reached: false,
        },
        type: EventType.botevent,
      })
    )
  })

  test('should create handoff option event', () => {
    const htEvent = createHtEvent(requestData, {
      action: EventAction.handoffOption,
      data: {
        queueId: 'handoffQueueIdTest',
        queueName: 'handoffQueueNameTest',
      },
    })

    expect(JSON.stringify(htEvent)).toBe(
      JSON.stringify({
        chat_id: 'chatIdTest',
        chat_language: 'es',
        chat_country: 'ES',
        format_version: 2,
        data: {
          action: EventAction.handoffOption,
          handoff_queue_id: 'handoffQueueIdTest',
          handoff_queue_name: 'handoffQueueNameTest',
        },
        type: EventType.botevent,
      })
    )
  })
})
