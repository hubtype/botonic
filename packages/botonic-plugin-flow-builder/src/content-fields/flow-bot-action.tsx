import {
  type BotContext,
  BotonicAction,
  EventAction,
  type EventBotAction,
} from '@botonic/core'
import type { ActionRequest } from '@botonic/react'

import type { FlowBuilderApi } from '../api'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtBotActionNode } from './hubtype-fields'

export class FlowBotAction extends ContentFieldsBase {
  public code: string
  public payload: string

  static fromHubtypeCMS(
    cmsBotAction: HtBotActionNode,
    cmsApi: FlowBuilderApi
  ): FlowBotAction {
    const newBotAction = new FlowBotAction(cmsBotAction.id)
    newBotAction.code = cmsBotAction.code
    newBotAction.payload = cmsApi.createPayloadWithParams(cmsBotAction)
    newBotAction.followUp = cmsBotAction.follow_up

    return newBotAction
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)
    const eventBotAction: EventBotAction = {
      action: EventAction.BotAction,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      flowNodeIsMeaningful: false,
      payload: this.payload,
    }
    const { action, ...eventArgs } = eventBotAction
    await trackEvent(botContext, action, eventArgs)
  }

  doBotAction(botContext: ActionRequest): void {
    botContext.session._botonic_action = `${BotonicAction.Redirect}:${this.payload}`
  }

  async processContent(botContext: BotContext): Promise<void> {
    this.doBotAction(botContext)
    await this.trackFlow(botContext)
    return
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
