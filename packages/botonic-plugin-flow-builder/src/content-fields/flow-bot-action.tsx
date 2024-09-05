import { BotonicAction } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
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

  doBotAction(request: ActionRequest): void {
    request.session._botonic_action = `${BotonicAction.Redirect}:${this.payload}`
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
