import {
  type BotContext,
  EventAction,
  type EventIntentSmart,
  NluType,
} from '@botonic/core'

import type { FlowBuilderApi } from '../api'
import type { HtSmartIntentNode } from '../content-fields/hubtype-fields/smart-intent'
import { SmartIntentsClient } from '../services/smart-intent-client'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'

export interface SmartIntentsInferenceConfig {
  useLatest: boolean
  numSmartIntentsToUse?: number
}

export class SmartIntentsResolver {
  private smartIntentsClient: SmartIntentsClient

  constructor(
    public cmsApi: FlowBuilderApi,
    public botContext: BotContext,
    public smartIntentsConfig: SmartIntentsInferenceConfig,
    public userTextOrTranscript: string
  ) {
    this.smartIntentsClient = new SmartIntentsClient(this.botContext)
  }

  async getNodeByInput(): Promise<HtSmartIntentNode | undefined> {
    if (!this.userTextOrTranscript) {
      return undefined
    }
    const smartIntentNodes = this.cmsApi.getSmartIntentNodes()
    if (!smartIntentNodes.length) {
      return undefined
    }

    const disabledSmartIntentTitles = smartIntentNodes
      .filter(smartIntentNode => smartIntentNode.content.is_active === false)
      .map(smartIntentNode => smartIntentNode.content.title)

    const params = {
      bot_id: this.botContext.session.bot.id,
      text: this.userTextOrTranscript,
      num_smart_intents_to_use: this.smartIntentsConfig.numSmartIntentsToUse,
      use_latest: this.resolveUseLatest(),
      disabled_smart_intent_titles: disabledSmartIntentTitles,
    }

    try {
      const response = await this.smartIntentsClient.getInference(params)
      const smartIntentNode = smartIntentNodes.find(
        smartIntentNode =>
          smartIntentNode.content.title === response.data.smart_intent_title
      )

      if (smartIntentNode) {
        const targetPayload = this.cmsApi.getPayload(smartIntentNode.target)
        this.botContext.input.nluResolution = {
          type: NluType.SmartIntent,
          matchedValue: smartIntentNode.content.title,
          payload: targetPayload,
        }

        const { flowId, flowName, flowNodeId, flowNodeContentId } =
          getCommonFlowContentEventArgsForContentId(
            this.botContext,
            smartIntentNode.id
          )

        const event: EventIntentSmart = {
          action: EventAction.IntentSmart,
          nluIntentSmartTitle: response.data.smart_intent_title,
          nluIntentSmartNumUsed: response.data.smart_intents_used.length,
          nluIntentSmartMessageId: this.botContext.input.message_id,
          userInput: this.userTextOrTranscript,
          flowThreadId: this.botContext.session.flow_thread_id as string,
          flowId,
          flowName,
          flowNodeContentId,
          flowNodeId,
        }
        const { action, ...eventArgs } = event

        await trackEvent(this.botContext, action, eventArgs)

        return smartIntentNode
      }
    } catch (e) {
      console.error(e)
    }
    return undefined
  }

  private resolveUseLatest(): boolean {
    if (this.botContext.session.is_test_integration) {
      return false
    }
    return this.smartIntentsConfig.useLatest
  }
}
