import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { ContentFieldsBase } from './content-fields-base'
import { HtGoToFlow, HtNodeWithContent } from './hubtype-fields'

export class FlowGoToFlow extends ContentFieldsBase {
  public targetFlowId: string = ''
  public targetFlowName: string = ''
  public targetId: string = ''

  static fromHubtypeCMS(
    component: HtGoToFlow,
    cmsApi: FlowBuilderApi
  ): FlowGoToFlow {
    const newGoToFlow = new FlowGoToFlow(component.id)
    newGoToFlow.targetFlowId = component.content.flow_id
    const targetId = cmsApi.getNodeByFlowId(component.content.flow_id).id
    newGoToFlow.targetId = targetId
    newGoToFlow.targetFlowName = cmsApi.getFlowName(component.content.flow_id)
    newGoToFlow.followUp = cmsApi.getNodeById<HtNodeWithContent>(targetId)

    return newGoToFlow
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async trackFlow(_request: ActionRequest): Promise<void> {
    // TODO: Implement tracking for go to flow
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
