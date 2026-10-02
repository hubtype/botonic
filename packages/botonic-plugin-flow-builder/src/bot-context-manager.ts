import {
  type BotContext,
  INPUT,
  PROVIDER,
  WhatsappInputOrigin,
} from '@botonic/core'

import type { FlowBuilderApi } from './api'
import {
  EMPTY_PAYLOAD,
  ON_CLOSE_HANDOFF_PAYLOAD,
  SEPARATOR,
  SOURCE_INFO_SEPARATOR,
} from './constants'
import { FlowHandoff } from './content-fields'
import {
  type HtBotActionNode,
  type HtHandoffNode,
  HtNodeWithContentType,
} from './content-fields/hubtype-fields'
import { getNextPayloadByUserInput } from './user-input'
import type { SmartIntentsInferenceConfig } from './user-input/smart-intent'
import { inputHasTextOrTranscript } from './utils/input'

export class BotContextManager {
  constructor(
    private readonly cmsApi: FlowBuilderApi,
    private readonly smartIntentsConfig: SmartIntentsInferenceConfig
  ) {}

  async prepareInputForRoutes(botContext: BotContext): Promise<void> {
    // When AI Agent is executed in Whatsapp, button payloads come as referral and must be converted to text being processed by the agent.
    this.convertWhatsappAiAgentEmptyPayloads(botContext)

    // If the payload is a push-flow payload, set first interaction to false
    this.updateFirstInteractionOnPushFlowPayload(botContext)

    this.resolveWhatsappContactRequestPayload(botContext)
    this.resolveOnCloseHandoffPayload(botContext)

    await this.resolvePayloadFromUserTextInput(botContext)

    this.cmsApi.removeCaptureUserInputId()
    this.removePayloadSourceSuffix(botContext)
    this.resolveBotActionPayload(botContext)
  }

  private async updateFirstInteractionOnPushFlowPayload(
    botContext: BotContext
  ): Promise<void> {
    if (this.cmsApi.isPushFlowPayload(botContext.input.payload)) {
      botContext.session.is_first_interaction = false
    }
  }

  private async resolvePayloadFromUserTextInput(
    botContext: BotContext
  ): Promise<void> {
    const checkUserTextInput =
      inputHasTextOrTranscript(botContext.input) && !botContext.input.payload

    if (!checkUserTextInput) {
      return
    }

    const resolvedLocale = this.cmsApi.getResolvedLocale()
    const nextPayload = await getNextPayloadByUserInput(
      this.cmsApi,
      resolvedLocale,
      botContext,
      this.smartIntentsConfig
    )
    botContext.input.payload = nextPayload
  }

  private resolveWhatsappContactRequestPayload(botContext: BotContext): void {
    if (
      botContext.input.type !== INPUT.CONTACT ||
      botContext.input.origin !== WhatsappInputOrigin.ContactRequest
    ) {
      return
    }

    const whatsappRequestContactInfoNode =
      this.cmsApi.getWhatsappRequestContactInfoNode()

    if (whatsappRequestContactInfoNode) {
      botContext.input.payload = this.cmsApi.getPayload(
        whatsappRequestContactInfoNode.content.button.target
      )
    }

    this.cmsApi.removeWhatsappRequestContactId()
  }

  private resolveOnCloseHandoffPayload(botContext: BotContext): void {
    if (botContext.input.payload?.startsWith(ON_CLOSE_HANDOFF_PAYLOAD)) {
      const handoffNodeId = botContext.input.payload.split(SEPARATOR)[1]
      const handoffNode = this.cmsApi.getNodeById<HtHandoffNode>(handoffNodeId)
      if (handoffNode && handoffNode.type === HtNodeWithContentType.HANDOFF) {
        const flowHandoff = FlowHandoff.fromHubtypeCMS(
          handoffNode,
          this.cmsApi.getResolvedLocale(),
          this.cmsApi
        )
        botContext.input.payload = flowHandoff.resolveOnClosePayload(botContext)
      }
    }
  }

  private convertWhatsappAiAgentEmptyPayloads(botContext: BotContext): void {
    if (botContext.session.user.provider === PROVIDER.WHATSAPP) {
      const shouldUseReferral =
        botContext.input.referral &&
        botContext.input.payload?.startsWith(EMPTY_PAYLOAD)

      if (shouldUseReferral) {
        botContext.input.type = INPUT.TEXT
        botContext.input.data = botContext.input.referral
      }
    }
  }

  private removePayloadSourceSuffix(botContext: BotContext): void {
    if (botContext.input.payload) {
      botContext.input.payload = this.removeSourceSuffix(
        botContext.input.payload
      )
    }
  }

  private resolveBotActionPayload(botContext: BotContext): void {
    if (
      botContext.input.payload &&
      this.cmsApi.isBotAction(botContext.input.payload)
    ) {
      const cmsBotAction = this.cmsApi.getNodeById<HtBotActionNode>(
        botContext.input.payload
      )

      botContext.input.payload =
        this.cmsApi.createPayloadWithParams(cmsBotAction)

      // Re-execute convertWhatsappAiAgentEmptyPayloads function to handle
      // the case that a BotAction has a payload equals to EMPTY_PAYLOAD
      this.convertWhatsappAiAgentEmptyPayloads(botContext)
    }
  }

  private removeSourceSuffix(payload: string): string {
    return payload.split(SOURCE_INFO_SEPARATOR)[0]
  }
}
