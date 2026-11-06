import {
  type BotContext,
  BotonicInputContextType,
  getInputContextOfType,
  type PushFlowContext,
} from '@botonic/core'

import { PUSH_FLOW_PAYLOAD } from './constants'
import type { FlowContent } from './content-fields'

export class CampaignExecution {
  public hasBotResponse = false
  private botContext: BotContext

  constructor(botContext: BotContext) {
    this.botContext = botContext
  }

  isActive(): boolean {
    if (!this.isPushFlowPayload()) {
      return false
    }

    return this.getPushFlowContext() !== undefined
  }

  get campaignId(): string | undefined {
    return this.getPushFlowContext()?.campaign_id
  }

  updateHasBotResponse(content: FlowContent): void {
    if (!this.isActive() || this.hasBotResponse) {
      return
    }
    if (content.producesBotResponse()) {
      this.hasBotResponse = true
    }
  }

  isPushFlowPayload(): boolean {
    const payload = this.botContext.input.payload
    return payload?.startsWith(PUSH_FLOW_PAYLOAD) ?? false
  }

  private getPushFlowContext(): PushFlowContext | undefined {
    return getInputContextOfType(
      this.botContext.input.context,
      BotonicInputContextType.PushFlow
    )
  }
}
