import { EventAction, type EventConditionalQueueStatus } from '@botonic/core'
import type { ActionRequest } from '@botonic/react'

import { getArgumentsByLocale } from '../functions'
import { HubtypeQueuesApi } from '../services/hubtype-queues-api'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type {
  HtFunctionArguments,
  HtFunctionResult,
} from './hubtype-fields/function'
import type {
  HtQueueStatusConditionalNode,
  HtQueueStatusConditionalResultMapping,
} from './hubtype-fields/queue-status-conditional'

enum QueueStatusResult {
  OPEN = 'open',
  CLOSED = 'closed',
  OPEN_WITHOUT_AGENTS = 'open-without-agents',
}

type ConditionalQueueStatusArgs = {
  queueId: string
  queueName: string
  checkAvailableAgents: boolean
}

export class FlowQueueStatusConditional extends ContentFieldsBase {
  public arguments: HtFunctionArguments[] = []
  public resultMapping: HtQueueStatusConditionalResultMapping
  public conditionalResult?: HtFunctionResult
  public queueId: string = ''
  public queueName: string = ''
  public isQueueOpen: boolean = false
  public isAvailableAgent: boolean = false

  static async fromHubtypeCMS(
    component: HtQueueStatusConditionalNode,
    locale: string
  ): Promise<FlowQueueStatusConditional> {
    const newChannelConditional = new FlowQueueStatusConditional(component.id)
    newChannelConditional.code = component.code
    newChannelConditional.arguments = component.content.arguments
    newChannelConditional.resultMapping = component.content
      .result_mapping as HtQueueStatusConditionalResultMapping
    await newChannelConditional.setConditionalResult(locale)

    return newChannelConditional
  }

  async setConditionalResult(locale: string): Promise<void> {
    const args = getArgumentsByLocale(this.arguments, locale)

    const queueId = args.find(arg => arg.name === 'queue_id')?.value || ''
    const queueName = args.find(arg => arg.name === 'queue_name')?.value || ''
    const checkAvailableAgents =
      (args.find(arg => arg.name === 'check_available_agents')
        ?.value as unknown as boolean) || false

    const queueStatus = await this.conditionalQueueStatus({
      queueId,
      queueName,
      checkAvailableAgents,
    })

    const conditionalResult = this.resultMapping.find(
      rMap => rMap.result === queueStatus
    )

    if (!conditionalResult) {
      throw new Error(
        `No conditional result found for node ${this.code} with queue: ${queueName}`
      )
    }
    this.conditionalResult = conditionalResult
    this.followUp = conditionalResult.target
  }

  async conditionalQueueStatus({
    queueId,
    checkAvailableAgents,
    queueName,
  }: ConditionalQueueStatusArgs): Promise<QueueStatusResult> {
    const queuesApi = new HubtypeQueuesApi(queueId, checkAvailableAgents)
    const data = await queuesApi.getAvailability()
    this.queueId = queueId
    this.queueName = queueName
    this.isQueueOpen = data.open
    this.isAvailableAgent = data.available_agents > 0

    if (checkAvailableAgents && data.open && data.available_agents === 0) {
      return QueueStatusResult.OPEN_WITHOUT_AGENTS
    }

    return data.open ? QueueStatusResult.OPEN : QueueStatusResult.CLOSED
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(request, this.id)
    if (!this.conditionalResult?.result) {
      console.warn(
        `Tracking event for node ${this.code} but no conditional result found`
      )
    }
    const eventQueueStatusConditional: EventConditionalQueueStatus = {
      action: EventAction.ConditionalQueueStatus,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      flowNodeIsMeaningful: false,
      queueId: this.queueId,
      queueName: this.queueName,
      isQueueOpen: this.isQueueOpen,
      isAvailableAgent: this.isAvailableAgent,
    }
    const { action, ...eventArgs } = eventQueueStatusConditional
    await trackEvent(request, action, eventArgs)
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
