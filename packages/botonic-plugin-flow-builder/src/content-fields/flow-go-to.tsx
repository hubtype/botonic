import { ActionRequest } from '@botonic/react'

import { ContentFieldsBase } from './content-fields-base'
import { HtGoToFlow } from './hubtype-fields'

export class FlowGoToFlow extends ContentFieldsBase {
  public targetFlowId?: string
  public targetId?: string

  static fromHubtypeCMS(component: HtGoToFlow): FlowGoToFlow {
    const newGoToFlow = new FlowGoToFlow(component.id)
    newGoToFlow.targetFlowId = component.content.flow_id

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
