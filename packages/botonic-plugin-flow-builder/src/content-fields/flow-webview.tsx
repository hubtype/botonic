import { EventAction, type EventWebviewActionTriggered } from '@botonic/core'
import type { ActionRequest } from '@botonic/react'

import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtWebviewExits, HtWebviewNode } from './hubtype-fields'

export class FlowWebview extends ContentFieldsBase {
  public webviewTargetId: string = ''
  public webviewName: string = ''
  public webviewComponentName: string = ''
  public exits: HtWebviewExits[] = []

  static fromHubtypeCMS(component: HtWebviewNode): FlowWebview {
    const newWebview = new FlowWebview(component.id)
    newWebview.webviewTargetId = component.content.webview_target_id
    newWebview.webviewName = component.content.webview_name
    newWebview.webviewComponentName = component.content.webview_component_name
    newWebview.exits = component.content.exits
    newWebview.followUp = component.follow_up

    return newWebview
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(request, this.id)

    const eventWebviewActionTriggered: EventWebviewActionTriggered = {
      action: EventAction.WebviewActionTriggered,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      flowNodeIsMeaningful: false,
      webviewTargetId: this.webviewTargetId,
      webviewName: this.webviewName,
    }
    const { action, ...eventArgs } = eventWebviewActionTriggered
    await trackEvent(request, action, eventArgs)
  }
}
