import {
  type BotContext,
  EventAction,
  type EventWebviewActionTriggered,
} from '@botonic/core'

import type { FlowBuilderApi } from '../api'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type {
  HtNodeWithContent,
  HtWebviewExits,
  HtWebviewNode,
} from './hubtype-fields'

export class FlowWebview extends ContentFieldsBase {
  public webviewTargetId: string = ''
  public webviewName: string = ''
  public webviewComponentName: string = ''
  public webviewParams: Record<string, string> = {}
  public exits: HtWebviewExits[] = []

  static fromHubtypeCMS(component: HtWebviewNode): FlowWebview {
    const newWebview = new FlowWebview(component.id)
    newWebview.webviewTargetId = component.content.webview_target_id
    newWebview.webviewName = component.content.webview_name
    newWebview.webviewComponentName = component.content.webview_component_name
    newWebview.webviewParams = component.content.webview_params ?? {}
    newWebview.exits = component.content.exits
    newWebview.followUp = component.follow_up

    return newWebview
  }

  getParams(
    botContext: BotContext,
    cmsApi: FlowBuilderApi
  ): Record<string, string> {
    const params: Record<string, string> = {
      webviewId: this.webviewTargetId,
      t: Date.now().toString(),
      ...this.getResolvedWebviewParams(botContext),
    }
    const exitSuccessContentID = this.getExitSuccessContentID(cmsApi)

    if (exitSuccessContentID) {
      params.exitSuccessContentID = exitSuccessContentID
    }
    return params
  }

  private getResolvedWebviewParams(
    botContext: BotContext
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(this.webviewParams).map(([key, value]) => [
        key,
        this.replaceVariables(value, botContext),
      ])
    )
  }

  private getExitSuccessContentID(cmsApi: FlowBuilderApi): string | undefined {
    const webviewSuccessExit = this.exits?.find(exit => exit.name === 'Success')
    const exitSuccessId = webviewSuccessExit?.target?.id
    if (!exitSuccessId) {
      return undefined
    }
    const exitNode = cmsApi.getNodeById<HtNodeWithContent>(exitSuccessId)

    return exitNode.code
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)

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
      webviewParams: this.webviewParams,
    }
    const { action, ...eventArgs } = eventWebviewActionTriggered
    await trackEvent(botContext, action, eventArgs)
  }

  async processContent(): Promise<void> {
    return
  }
}
