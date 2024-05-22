import { createHtEvent, EventName, HandoffAction } from '../src'
import { getRequestData } from './helpers'

describe('Create handoff events', () => {
  const requestData = getRequestData()
  test('should create handoff success event', () => {
    const htEvent = createHtEvent(requestData, {
      action: HandoffAction.handoffSuccess,
      data: {
        handoffQueueId: 'handoffQueueIdTest',
        handoffQueueName: 'handoffQueueNameTest',
        handoffCaseId: 'handoffCaseIdTest',
        isQueueOpen: true,
        handoffIsAvailableAgent: true,
        handoffIsThresholdReached: false,
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
          action: HandoffAction.handoffSuccess,
          handoff_queue_id: 'handoffQueueIdTest',
          handoff_queue_name: 'handoffQueueNameTest',
          handoff_case_id: 'handoffCaseIdTest',
          is_queue_open: true,
          handoff_is_available_agent: true,
          handoff_is_threshold_reached: false,
        },
        type: EventName.flow,
      })
    )
  })

  test('should create handoff fail event', () => {
    const htEvent = createHtEvent(requestData, {
      action: HandoffAction.handoffFail,
      data: {
        handoffQueueId: 'handoffQueueIdTest',
        handoffQueueName: 'handoffQueueNameTest',
        handoffCaseId: 'handoffCaseIdTest',
        isQueueOpen: false,
        handoffIsAvailableAgent: false,
        handoffIsThresholdReached: false,
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
          action: HandoffAction.handoffFail,
          handoff_queue_id: 'handoffQueueIdTest',
          handoff_queue_name: 'handoffQueueNameTest',
          handoff_case_id: 'handoffCaseIdTest',
          is_queue_open: false,
          handoff_is_available_agent: false,
          handoff_is_threshold_reached: false,
        },
        type: EventName.flow,
      })
    )
  })

  test('should create handoff option event', () => {
    const htEvent = createHtEvent(requestData, {
      action: HandoffAction.handoffOption,
      data: {
        handoffQueueId: 'handoffQueueIdTest',
        handoffQueueName: 'handoffQueueNameTest',
        handoffCaseId: 'handoffCaseIdTest',
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
          action: HandoffAction.handoffOption,
          handoff_queue_id: 'handoffQueueIdTest',
          handoff_queue_name: 'handoffQueueNameTest',
          handoff_case_id: 'handoffCaseIdTest',
        },
        type: EventName.flow,
      })
    )
  })
})
