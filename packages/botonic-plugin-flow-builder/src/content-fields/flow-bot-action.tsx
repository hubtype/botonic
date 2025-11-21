import { BotonicAction, EventAction, EventBotAction } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { HtBotActionNode } from './hubtype-fields'

export class FlowBotAction extends ContentFieldsBase {
  public code: string
  public payload: string

  static fromHubtypeCMS(
    cmsBotAction: HtBotActionNode,
    _locale: string,
    cmsApi: FlowBuilderApi
  ): FlowBotAction {
    const newBotAction = new FlowBotAction(cmsBotAction.id)
    newBotAction.code = cmsBotAction.code
    newBotAction.payload = cmsApi.createPayloadWithParams(cmsBotAction)

    return newBotAction
  }

  private async trackBotActionEvent(request: ActionRequest): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(request, this.id)
    const eventBotAction: EventBotAction = {
      action: EventAction.BotAction,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      payload: this.payload,
    }
    const { action, ...eventArgs } = eventBotAction
    await trackEvent(request, action, eventArgs)
  }

  async doBotAction(request: ActionRequest): Promise<void> {
    await this.trackBotActionEvent(request)
    request.session._botonic_action = `${BotonicAction.Redirect}:${this.payload}`
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
