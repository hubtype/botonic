import {
  type BotContext,
  INPUT,
  type Plugin,
  PROVIDER,
  type ResolvedPlugins,
  type Session,
  WhatsappInputOrigin,
} from '@botonic/core'
import { v7 as uuidv7 } from 'uuid'

import { FlowBuilderApi } from './api'
import {
  EMPTY_PAYLOAD,
  FLOW_BUILDER_API_URL_PROD,
  ON_CLOSE_HANDOFF_PAYLOAD,
  SEPARATOR,
  SOURCE_INFO_SEPARATOR,
} from './constants'
import { type FlowContent, FlowHandoff } from './content-fields'
import {
  type HtBotActionNode,
  type HtFlowBuilderData,
  type HtHandoffNode,
  type HtNodeWithContent,
  HtNodeWithContentType,
} from './content-fields/hubtype-fields'
import { FlowFactory } from './flow-factory'
import { CustomFunction, DEFAULT_FUNCTION_NAMES } from './functions'
import {
  type AiAgentFunction,
  type BotonicPluginFlowBuilderOptions,
  type ContentFilter,
  FlowBuilderJSONVersion,
  type InShadowingConfig,
  type PayloadParamsBase,
  type RatingSubmittedInfo,
  type TrackEventFunction,
} from './types'
import { getNextPayloadByUserInput } from './user-input'
import type { SmartIntentsInferenceConfig } from './user-input/smart-intent'
import { resolveGetAccessToken } from './utils/authentication'
import { inputHasTextOrTranscript } from './utils/input'

// TODO: Create a proper service to wrap all calls and allow api versioning

export default class BotonicPluginFlowBuilder implements Plugin {
  public cmsApi: FlowBuilderApi
  private flow?: HtFlowBuilderData
  private functions: Record<any, any>
  private botContext: BotContext
  public getAccessToken: (session: Session) => string
  public trackEvent?: TrackEventFunction
  public getAiAgentResponse?: AiAgentFunction
  public smartIntentsConfig: SmartIntentsInferenceConfig
  public inShadowing: InShadowingConfig
  public contentFilters: ContentFilter[]

  // TODO: Rethink how we construct FlowBuilderApi to be simpler
  public jsonVersion: FlowBuilderJSONVersion
  public apiUrl: string
  public customRatingMessageEnabled: boolean
  public disableAIAgentInFirstInteraction: boolean

  constructor(options: BotonicPluginFlowBuilderOptions<ResolvedPlugins, any>) {
    this.apiUrl = options.apiUrl || FLOW_BUILDER_API_URL_PROD
    this.jsonVersion = options.jsonVersion || FlowBuilderJSONVersion.LATEST
    this.flow = options.flow
    this.getAccessToken = resolveGetAccessToken(options.getAccessToken)
    this.trackEvent = options.trackEvent
    this.getAiAgentResponse = options.getAiAgentResponse
    this.smartIntentsConfig = {
      ...options?.smartIntentsConfig,
      useLatest: this.jsonVersion === FlowBuilderJSONVersion.LATEST,
    }
    const customFunctions = options.customFunctions || {}
    this.functions = customFunctions
    this.inShadowing = {
      allowKeywords: options.inShadowing?.allowKeywords || false,
      allowSmartIntents: options.inShadowing?.allowSmartIntents || false,
      allowAiAgents: options.inShadowing?.allowAiAgents || false,
    }
    this.contentFilters = options.contentFilters || []
    this.customRatingMessageEnabled =
      options.customRatingMessageEnabled || false
    this.disableAIAgentInFirstInteraction =
      options.disableAIAgentInFirstInteraction || false
  }

  resolveFlowUrl(botContext: BotContext): string {
    if (botContext.session.is_test_integration) {
      return `${this.apiUrl}/v1/bot_flows/{bot_id}/versions/${FlowBuilderJSONVersion.DRAFT}/`
    }
    return `${this.apiUrl}/v1/bot_flows/{bot_id}/versions/${this.jsonVersion}/`
  }

  async pre(botContext: BotContext): Promise<void> {
    this.botContext = botContext
    this.cmsApi = await FlowBuilderApi.create({
      flowUrl: this.resolveFlowUrl(botContext),
      url: this.apiUrl,
      flow: this.flow,
      accessToken: this.getAccessToken(botContext.session),
      botContext: this.botContext,
    })

    // When AI Agent is executed in Whatsapp, button payloads come as referral and must be converted to text being processed by the agent.
    this.convertWhatsappAiAgentEmptyPayloads(botContext)

    if (this.cmsApi.isPushFlowPayload(botContext.input.payload)) {
      botContext.session.is_first_interaction = false
    }

    this.resolveWhatsappContactRequestPayload(botContext)
    this.resolveOnCloseHandoffPayload(botContext)

    const checkUserTextInput =
      inputHasTextOrTranscript(botContext.input) && !botContext.input.payload

    if (checkUserTextInput) {
      const resolvedLocale = this.cmsApi.getResolvedLocale()
      const nextPayload = await getNextPayloadByUserInput(
        this.cmsApi,
        resolvedLocale,
        botContext,
        this.smartIntentsConfig
      )
      botContext.input.payload = nextPayload
    }

    await this.updateRequestBeforeRoutes(botContext)
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

  private async updateRequestBeforeRoutes(
    botContext: BotContext
  ): Promise<void> {
    this.cmsApi.removeCaptureUserInputId()
    if (botContext.input.payload) {
      botContext.input.payload = this.removeSourceSuffix(
        botContext.input.payload
      )

      if (this.cmsApi.isBotAction(botContext.input.payload)) {
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
  }

  private removeSourceSuffix(payload: string): string {
    return payload.split(SOURCE_INFO_SEPARATOR)[0]
  }

  post(botContext: BotContext): void {
    botContext.input.nluResolution = undefined
    delete botContext.session.user.system_locale_updated
  }

  async getContentsByContentID(
    contentID: string,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const node = this.cmsApi.getNodeByContentID(contentID) as HtNodeWithContent
    return await this.getContentsByNode(node, prevContents)
  }

  getUUIDByContentID(contentID: string): string {
    const node = this.cmsApi.getNodeByContentID(contentID)
    return node.id
  }

  private async getContentsById(
    id: string,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const node = this.cmsApi.getNodeById(id) as HtNodeWithContent
    return await this.getContentsByNode(node, prevContents)
  }

  async getStartContents(): Promise<FlowContent[]> {
    const startNode = this.cmsApi.getStartNode()
    this.botContext.session.flow_thread_id = uuidv7()
    return await this.getContentsByNode(startNode)
  }

  async getContentsByNode(
    node: HtNodeWithContent,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const contents = prevContents || []
    const resolvedLocale = this.cmsApi.getResolvedLocale()

    if (
      node.type === HtNodeWithContentType.FUNCTION &&
      !DEFAULT_FUNCTION_NAMES.includes(node.content.action)
    ) {
      const customFunctionResolver = new CustomFunction(
        this.functions,
        this.botContext,
        resolvedLocale
      )
      const targetId = await customFunctionResolver.call(node)
      return this.getContentsById(targetId, contents)
    }

    const flowFactory = new FlowFactory(
      this.botContext,
      this.cmsApi,
      resolvedLocale
    )
    const content = await flowFactory.getFlowContent(node)
    if (content) {
      contents.push(content)
    }

    // If node is BOT_ACTION not add more contents to render, next nodes render after execute action
    if (node.type === HtNodeWithContentType.BOT_ACTION) {
      return contents
    }

    // TODO: prevent infinite recursive calls
    if (content?.followUp) {
      return this.getContentsById(content.followUp.id, contents)
    } else if (node.follow_up) {
      console.log('FOLLOWUP FROM NODE-------> OLD SYSTEM')
      return this.getContentsById(node.follow_up.id, contents)
    }

    return contents
  }

  getPayloadParams<T extends PayloadParamsBase>(payload: string): T {
    const payloadParams = JSON.parse(payload.split(SEPARATOR)[1] || '{}')
    return payloadParams
  }

  getFlowName(flowId: string): string {
    return this.cmsApi.getFlowName(flowId)
  }

  getRatingSubmittedInfo(payload: string): RatingSubmittedInfo {
    const buttonId = payload?.split(SEPARATOR)[1]
    const ratingNode = this.cmsApi.getRatingNodeByButtonId(buttonId)

    const ratingButton = this.cmsApi.getRatingButtonById(ratingNode, buttonId)
    const possibleOptions = ratingNode.content.buttons.map(
      button => button.text
    )
    const possibleValues = ratingNode.content.buttons.map(
      button => button.value
    )

    return {
      ...ratingButton,
      possibleOptions,
      possibleValues,
    }
  }

  setInShadowing(inShadowing: InShadowingConfig): void {
    this.inShadowing = inShadowing
  }
}

export * from './action'
export { AGENT_RATING_PAYLOAD, EMPTY_PAYLOAD } from './constants'
export * from './content-fields'
export type { HtBotActionNode } from './content-fields/hubtype-fields'
export {
  getCommonFlowContentEventArgsForContentId,
  trackFlowContent,
} from './tracking'
export {
  type BotonicPluginFlowBuilderOptions,
  type ContentFilter,
  FlowBuilderJSONVersion,
  type PayloadParamsBase,
  type RatingSubmittedInfo,
} from './types'
export * from './webview'
