import { ActionRequest } from '@botonic/react'
import React from 'react'

import {
  ConditionalQueueStatusArgs,
  HubtypeQueuesApi,
  QueueStatusResult,
} from '../functions/conditional-queue-status'
import { getArgumentsByLocale } from '../functions/utils'
import { ContentFieldsBase } from './content-fields-base'
import {
  HtFunctionArguments,
  HtFunctionResult,
} from './hubtype-fields/function'
import {
  HtQueueStatusConditionalNode,
  HtQueueStatusConditionalResultMapping,
} from './hubtype-fields/queue-status-conditional'

export class FlowQueueStatusConditional extends ContentFieldsBase {
  public arguments: HtFunctionArguments[] = []
  public resultMapping: HtQueueStatusConditionalResultMapping
  public conditionalResult?: HtFunctionResult

  static async fromHubtypeCMS(
    component: HtQueueStatusConditionalNode,
    request: ActionRequest,
    locale: string
  ): Promise<FlowQueueStatusConditional> {
    const newChannelConditional = new FlowQueueStatusConditional(component.id)
    newChannelConditional.code = component.code
    newChannelConditional.arguments = component.content.arguments
    newChannelConditional.resultMapping = component.content
      .result_mapping as HtQueueStatusConditionalResultMapping
    await newChannelConditional.setConditionalResult(request, locale)

    return newChannelConditional
  }

  async setConditionalResult(
    request: ActionRequest,
    locale: string
  ): Promise<void> {
    const args = getArgumentsByLocale(this.arguments, locale)

    const queue_id = args.find(arg => arg.name === 'queue_id')?.value || ''
    const queue_name = args.find(arg => arg.name === 'queue_name')?.value || ''
    const check_available_agents =
      (args.find(arg => arg.name === 'check_available_agents')
        ?.value as unknown as boolean) || false

    const queueStatus = await this.conditionalQueueStatus({
      request,
      queue_id,
      queue_name,
      check_available_agents,
    })

    const conditionalResult = this.resultMapping.find(
      rMap => rMap.result === queueStatus
    )

    if (!conditionalResult) {
      throw new Error(
        `No conditional result found for node ${this.code} with queue: ${queue_name}`
      )
    }
    this.conditionalResult = conditionalResult
    this.followUp = conditionalResult.target
  }

  async conditionalQueueStatus({
    queue_id,
    check_available_agents,
  }: ConditionalQueueStatusArgs): Promise<QueueStatusResult> {
    const queuesApi = new HubtypeQueuesApi(queue_id, check_available_agents)
    const data = await queuesApi.getAvailability()
    if (check_available_agents && data.open && data.available_agents === 0) {
      return QueueStatusResult.OPEN_WITHOUT_AGENTS
    }
    return data.open ? QueueStatusResult.OPEN : QueueStatusResult.CLOSED
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async trackFlow(_request: ActionRequest): Promise<void> {
    // TODO: Implement tracking for queue status conditional
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toBotonic(_id: string, _request: ActionRequest): JSX.Element {
    return <></>
  }
}
