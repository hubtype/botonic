import {
  type BotContext,
  BotonicInputContextType,
  getInputContextOfType,
} from '@botonic/core'
import type { FlowBuilderApi } from '../api'
import type { HtNodeWithContent } from '../content-fields/hubtype-fields'
import type BotonicPluginFlowBuilder from '../index'
import type { FlowBuilderContentsResult } from './contents-result'
import type { FlowBuilderContext } from './context'

export enum PushFlowErrorCode {
  NoCampaignContext = 'NoCampaignContext',
  NoCampaignStartNode = 'NoCampaignStartNode',
  NoCampaignFollowUpNode = 'NoCampaignFollowUpNode',
}

export class PushFlowError extends Error {
  readonly code: PushFlowErrorCode

  constructor(code: PushFlowErrorCode, reason: string) {
    super(`push-flow failed: ${reason}`)
    this.code = code
    this.name = 'PushFlowError'
  }
}

export class PushFlowResolver {
  private botContext: BotContext
  private cmsApi: FlowBuilderApi
  private flowBuilderPlugin: BotonicPluginFlowBuilder

  constructor(context: FlowBuilderContext) {
    this.botContext = context.request
    this.cmsApi = context.cmsApi
    this.flowBuilderPlugin = context.flowBuilderPlugin
  }

  async getContents(): Promise<FlowBuilderContentsResult> {
    const campaignContext = getInputContextOfType(
      this.botContext.input.context,
      BotonicInputContextType.PushFlow
    )

    if (!campaignContext) {
      throw new PushFlowError(
        PushFlowErrorCode.NoCampaignContext,
        'No campaign context found in input context'
      )
    }

    const {
      campaign_flow_id: campaignFlowId,
      campaign_follow_up_id: campaignFollowUpId,
    } = campaignContext

    const campaignStartNode = this.getCampaignStartNode(campaignFlowId)
    const followUpNode = campaignFollowUpId
      ? this.cmsApi.getNodeById<HtNodeWithContent>(campaignFollowUpId)
      : undefined

    if (campaignFollowUpId && !followUpNode) {
      throw new PushFlowError(
        PushFlowErrorCode.NoCampaignFollowUpNode,
        'No campaign follow up node found'
      )
    }

    return {
      contents: await this.flowBuilderPlugin.getContentsByNode(
        followUpNode ?? campaignStartNode
      ),
    }
  }

  private getCampaignStartNode(campaignId: string): HtNodeWithContent {
    const campaignStartNode =
      this.cmsApi.getNodeByCampaignId<HtNodeWithContent>(campaignId)

    if (!campaignStartNode) {
      throw new PushFlowError(
        PushFlowErrorCode.NoCampaignStartNode,
        'No campaign start node found'
      )
    }

    return campaignStartNode
  }
}
