import { EventAction, type EventRedirectFlow } from '@botonic/core'
import type { ActionRequest } from '@botonic/react'
import type { FlowBuilderApi } from '../api'
import { AI_AGENTS_FLOW_NAME } from '../constants'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtGoToFlow, HtNodeWithContent } from './hubtype-fields'

export class FlowGoToFlow extends ContentFieldsBase {
  public flowTargetId: string = ''
  public flowTargetName: string = ''
  public targetId: string = ''

  static fromHubtypeCMS(
    component: HtGoToFlow,
    cmsApi: FlowBuilderApi
  ): FlowGoToFlow {
    const newGoToFlow = new FlowGoToFlow(component.id)
    newGoToFlow.code = component.code
    newGoToFlow.flowTargetId = component.content.flow_id
    const targetId = cmsApi.getNodeByFlowId(component.content.flow_id).id
    newGoToFlow.targetId = targetId
    newGoToFlow.flowTargetName = cmsApi.getFlowName(component.content.flow_id)
    newGoToFlow.followUp = cmsApi.getNodeById<HtNodeWithContent>(targetId)

    return newGoToFlow
  }

  static async resolveToAiAgentsFlow(
    botContext: ActionRequest,
    component: HtGoToFlow,
    cmsApi: FlowBuilderApi
  ): Promise<void> {
    const goToFlowContent = FlowGoToFlow.fromHubtypeCMS(component, cmsApi)
    if (goToFlowContent.flowTargetName === AI_AGENTS_FLOW_NAME) {
      await goToFlowContent.trackFlow(botContext)
      botContext.input.payload = undefined
    }
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(request, this.id)
    const eventGoToFlow: EventRedirectFlow = {
      action: EventAction.RedirectFlow,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId: flowNodeContentId || 'Go to flow',
      flowTargetId: this.flowTargetId,
      flowTargetName: this.flowTargetName,
      flowNodeIsMeaningful: false,
    }
    const { action, ...eventArgs } = eventGoToFlow
    await trackEvent(request, action, eventArgs)
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
