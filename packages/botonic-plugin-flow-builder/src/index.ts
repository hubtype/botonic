import {
  INPUT,
  type Plugin,
  type PluginPreRequest,
  PROVIDER,
  type ResolvedPlugins,
  type Session,
} from '@botonic/core'
import type { ActionRequest } from '@botonic/react'
import { v7 as uuidv7 } from 'uuid'

import { FlowBuilderApi } from './api'
import {
  EMPTY_PAYLOAD,
  FLOW_BUILDER_API_URL_PROD,
  SEPARATOR,
  SOURCE_INFO_SEPARATOR,
} from './constants'
import type { FlowContent } from './content-fields'
import {
  type HtBotActionNode,
  type HtFlowBuilderData,
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
  type KnowledgeBaseFunction,
  type PayloadParamsBase,
  type RatingSubmittedInfo,
  type TrackEventFunction,
} from './types'
import { getNextPayloadByUserInput } from './user-input'
import type { SmartIntentsInferenceConfig } from './user-input/smart-intent'
import { inputHasTextData, resolveGetAccessToken } from './utils'

// TODO: Create a proper service to wrap all calls and allow api versioning

export default class BotonicPluginFlowBuilder implements Plugin {
  public cmsApi: FlowBuilderApi
  private flow?: HtFlowBuilderData
  private functions: Record<any, any>
  private currentRequest: PluginPreRequest
  public getAccessToken: (session: Session) => string
  public trackEvent?: TrackEventFunction
  public getKnowledgeBaseResponse?: KnowledgeBaseFunction
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
    this.getKnowledgeBaseResponse = options.getKnowledgeBaseResponse
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
      allowKnowledgeBases: options.inShadowing?.allowKnowledgeBases || false,
    }
    this.contentFilters = options.contentFilters || []
    this.customRatingMessageEnabled =
      options.customRatingMessageEnabled || false
    this.disableAIAgentInFirstInteraction =
      options.disableAIAgentInFirstInteraction || false
  }

  resolveFlowUrl(request: PluginPreRequest): string {
    if (request.session.is_test_integration) {
      return `${this.apiUrl}/v1/bot_flows/{bot_id}/versions/${FlowBuilderJSONVersion.DRAFT}/`
    }
    return `${this.apiUrl}/v1/bot_flows/{bot_id}/versions/${this.jsonVersion}/`
  }

  async pre(request: PluginPreRequest): Promise<void> {
    // When AI Agent is executed in Whatsapp, button payloads come as referral and must be converted to text being processed by the agent.
    this.convertWhatsappAiAgentEmptyPayloads(request)

    this.currentRequest = request
    this.cmsApi = await FlowBuilderApi.create({
      flowUrl: this.resolveFlowUrl(request),
      url: this.apiUrl,
      flow: this.flow,
      accessToken: this.getAccessToken(request.session),
      request: this.currentRequest,
    })

    const checkUserTextInput =
      inputHasTextData(request.input) && !request.input.payload

    if (checkUserTextInput) {
      const resolvedLocale = this.cmsApi.getResolvedLocale()
      const nextPayload = await getNextPayloadByUserInput(
        this.cmsApi,
        resolvedLocale,
        request as unknown as ActionRequest,
        this.smartIntentsConfig
      )
      request.input.payload = nextPayload
    }

    this.updateRequestBeforeRoutes(request)
  }

  private convertWhatsappAiAgentEmptyPayloads(request: PluginPreRequest): void {
    if (request.session.user.provider === PROVIDER.WHATSAPP) {
      const shouldUseReferral =
        request.input.referral &&
        request.input.payload?.startsWith(EMPTY_PAYLOAD)

      if (shouldUseReferral) {
        request.input.type = INPUT.TEXT
        request.input.data = request.input.referral
      }
    }
  }

  private updateRequestBeforeRoutes(request: PluginPreRequest): void {
    this.cmsApi.removeCaptureUserInputId()
    if (request.input.payload) {
      request.input.payload = this.removeSourceSuffix(request.input.payload)

      if (this.cmsApi.isBotAction(request.input.payload)) {
        const cmsBotAction = this.cmsApi.getNodeById<HtBotActionNode>(
          request.input.payload
        )

        request.input.payload =
          this.cmsApi.createPayloadWithParams(cmsBotAction)

        // Re-execute convertWhatsappAiAgentEmptyPayloads function to handle
        // the case that a BotAction has a payload equals to EMPTY_PAYLOAD
        this.convertWhatsappAiAgentEmptyPayloads(request)
      }
    }
  }

  private removeSourceSuffix(payload: string): string {
    return payload.split(SOURCE_INFO_SEPARATOR)[0]
  }

  post(request: PluginPreRequest): void {
    request.input.nluResolution = undefined
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
    this.currentRequest.session.flow_thread_id = uuidv7()
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
        this.currentRequest,
        resolvedLocale
      )
      const targetId = await customFunctionResolver.call(node)
      return this.getContentsById(targetId, contents)
    }

    const flowFactory = new FlowFactory(
      this.currentRequest,
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
}

export * from './action'
export { AGENT_RATING_PAYLOAD, EMPTY_PAYLOAD } from './constants'
export * from './content-fields'
export { HtBotActionNode } from './content-fields/hubtype-fields'
export { trackFlowContent } from './tracking'
export {
  BotonicPluginFlowBuilderOptions,
  ContentFilter,
  FlowBuilderJSONVersion,
  PayloadParamsBase,
  RatingSubmittedInfo,
} from './types'
export * from './webview'
