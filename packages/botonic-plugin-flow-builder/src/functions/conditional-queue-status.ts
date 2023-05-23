import { ActionRequest } from '@botonic/react'
import axios from 'axios'

import { getFlowBuilderPlugin } from '../helpers'
import { getWebpackEnvVar } from '../utils'

const _HUBTYPE_API_URL_ = getWebpackEnvVar(
  // @ts-ignore
  typeof HUBTYPE_API_URL !== 'undefined' && HUBTYPE_API_URL,
  'HUBTYPE_API_URL',
  'https://api.hubtype.com'
)

type ConditionalQueueStatusArgs = {
  request: ActionRequest
  queue_id: string
  queue_name: string
}

export async function conditionalQueueStatus({
  request,
  queue_id,
  queue_name,
}: ConditionalQueueStatusArgs): Promise<string> {
  const response = await axios.get(
    `${_HUBTYPE_API_URL_}/v1/queues/${queue_id}/availability/`,
    // TODO: Make it configurable in the future
    {
      params: {
        check_queue_schedule: true,
        check_waiting_cases: false,
        check_available_agents: false,
      },
    }
  )
  const isAvailable = response.data.available

  console.log('conditionalQueueStatus', { data: response.data })
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  if (flowBuilderPlugin.trackEvent) {
    const eventName = 'QUEUE_STATUS'
    const args = {
      queue_id,
      queue_name,
      status: isAvailable ? 'open' : 'closed',
    }
    await flowBuilderPlugin.trackEvent(request, eventName, args)
  }

  return isAvailable ? 'open' : 'closed'
}
