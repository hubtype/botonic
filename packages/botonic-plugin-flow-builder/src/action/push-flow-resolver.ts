import type { BotContext } from '@botonic/core'
import type { FlowBuilderApi } from '../api'
import { SEPARATOR } from '../constants'
import type { HtNodeWithContent } from '../content-fields/hubtype-fields'
import type BotonicPluginFlowBuilder from '../index'
import type { FlowBuilderContentsResult } from './contents-result'
import type { FlowBuilderContext } from './context'

export enum PushFlowErrorCode {
  NoInputPayload = 'NoInputPayload',
  NoPushFlowId = 'NoPushFlowId',
  NoCampaignStartNode = 'NoCampaignStartNode',
  NoCampaignId = 'NoCampaignId',
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
    const pushFlowId = this.getPushFlowId()
    const pushFlowNode = this.getPushFlowNode(pushFlowId)
    const campaignId = this.getCampaignId()

    return {
      contents: await this.flowBuilderPlugin.getContentsByNode(pushFlowNode),
      campaignFirstMessageId: campaignId,
    }
  }

  private getPushFlowId(): string {
    const payload = this.botContext.input.payload

    if (!payload) {
      throw new PushFlowError(
        PushFlowErrorCode.NoInputPayload,
        'No payload found in input'
      )
    }

    const parts = payload.split(SEPARATOR)
    const pushFlowId = parts.length > 1 ? parts[1] : ''

    if (!pushFlowId) {
      throw new PushFlowError(
        PushFlowErrorCode.NoPushFlowId,
        'No push flow id found in input payload'
      )
    }

    return pushFlowId
  }

  private getPushFlowNode(pushFlowId: string): HtNodeWithContent {
    const pushFlowNode =
      this.cmsApi.getNodeByCampaignId<HtNodeWithContent>(pushFlowId)

    if (!pushFlowNode) {
      throw new PushFlowError(
        PushFlowErrorCode.NoCampaignStartNode,
        'No campaign start node found'
      )
    }

    return pushFlowNode
  }

  private getCampaignId(): string {
    const campaignId =
      this.botContext.input.context &&
      'campaign_id' in this.botContext.input.context
        ? this.botContext.input.context.campaign_id
        : undefined

    if (!campaignId) {
      throw new PushFlowError(
        PushFlowErrorCode.NoCampaignId,
        'No campaign id found in input context'
      )
    }

    return campaignId
  }
}
