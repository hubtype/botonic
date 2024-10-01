import { Plugin, PluginPreRequest, Session } from '@botonic/core'
import { ActionRequest } from '@botonic/react'
import { v4 as uuid } from 'uuid'

import { FlowBuilderApi } from './api'
import {
  FLOW_BUILDER_API_URL_PROD,
  SEPARATOR,
  SOURCE_INFO_SEPARATOR,
} from './constants'
import {
  FlowBotAction,
  FlowCarousel,
  FlowContent,
  FlowHandoff,
  FlowImage,
  FlowKnowledgeBase,
  FlowText,
  FlowVideo,
  FlowWhatsappButtonList,
  FlowWhatsappCtaUrlButtonNode,
} from './content-fields'
import {
  HtFlowBuilderData,
  HtFunctionArgument,
  HtFunctionArguments,
  HtFunctionNode,
  HtNodeComponent,
  HtNodeWithContent,
  HtNodeWithContentType,
} from './content-fields/hubtype-fields'
import { DEFAULT_FUNCTIONS } from './functions'
import {
  BotonicPluginFlowBuilderOptions,
  FlowBuilderJSONVersion,
  KnowledgeBaseFunction,
  PayloadParamsBase,
  TrackEventFunction,
} from './types'
import { getNodeByUserInput } from './user-input'
import { SmartIntentsInferenceConfig } from './user-input/smart-intent'
import { inputHasTextData, resolveGetAccessToken } from './utils'
export default class BotonicPluginFlowBuilder implements Plugin {
  public cmsApi: FlowBuilderApi
  private flow?: HtFlowBuilderData
  private functions: Record<any, any>
  private currentRequest: PluginPreRequest
  private getAccessToken: (session: Session) => string
  public getLocale: (session: Session) => string
  public trackEvent?: TrackEventFunction
  public getKnowledgeBaseResponse?: KnowledgeBaseFunction
  public smartIntentsConfig: SmartIntentsInferenceConfig

  // TODO: Rethink how we construct FlowBuilderApi to be simpler
  public jsonVersion: FlowBuilderJSONVersion
  public apiUrl: string

  constructor(readonly options: BotonicPluginFlowBuilderOptions) {
    this.apiUrl = options.apiUrl || FLOW_BUILDER_API_URL_PROD
    this.jsonVersion = options.jsonVersion || FlowBuilderJSONVersion.LATEST
    this.flow = options.flow
    this.getLocale = options.getLocale
    this.getAccessToken = resolveGetAccessToken(options)
    this.trackEvent = options.trackEvent
    this.getKnowledgeBaseResponse = options.getKnowledgeBaseResponse
    this.smartIntentsConfig = {
      ...options?.smartIntentsConfig,
      useLatest: this.jsonVersion === FlowBuilderJSONVersion.LATEST,
    }
    const customFunctions = options.customFunctions || {}
    this.functions = { ...DEFAULT_FUNCTIONS, ...customFunctions }
  }

  resolveFlowUrl(request: PluginPreRequest): string {
    if (request.session.is_test_integration) {
      return `${this.apiUrl}/flow/${FlowBuilderJSONVersion.DRAFT}`
    }
    return `${this.apiUrl}/flow/${this.jsonVersion}`
  }

  async pre(request: PluginPreRequest): Promise<void> {
    this.currentRequest = request
    this.cmsApi = await FlowBuilderApi.create({
      url: this.resolveFlowUrl(request),
      flow: this.flow,
      accessToken: this.getAccessToken(request.session),
      request: this.currentRequest,
    })

    const checkUserTextInput =
      inputHasTextData(request.input) &&
      !request.input.payload &&
      !request.session.is_first_interaction

    if (checkUserTextInput) {
      const locale = this.getLocale(request.session)
      const resolvedLocale = this.cmsApi.getResolvedLocale(locale)
      const nodeByUserInput = await getNodeByUserInput(
        this.cmsApi,
        resolvedLocale,
        request as unknown as ActionRequest,
        this.smartIntentsConfig
      )
      request.input.payload = this.cmsApi.getPayload(nodeByUserInput?.target)
    }

    this.updateRequestBeforeRoutes(request)
  }

  private updateRequestBeforeRoutes(request: PluginPreRequest) {
    if (request.input.payload) {
      request.input.payload = this.removeSourceSufix(request.input.payload)
    }
  }

  private removeSourceSufix(payload: string): string {
    return payload.split(SOURCE_INFO_SEPARATOR)[0]
  }

  async getContentsByContentID(
    contentID: string,
    locale: string,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const node = this.cmsApi.getNodeByContentID(contentID) as HtNodeWithContent
    return await this.getContentsByNode(node, locale, prevContents)
  }

  getUUIDByContentID(contentID: string): string {
    const node = this.cmsApi.getNodeByContentID(contentID)
    return node.id
  }

  private async getContentsById(
    id: string,
    locale: string,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const node = this.cmsApi.getNodeById(id) as HtNodeWithContent
    return await this.getContentsByNode(node, locale, prevContents)
  }

  async getStartContents(locale: string): Promise<FlowContent[]> {
    const resolvedLocale = this.cmsApi.getResolvedLocale(locale)
    const startNode = this.cmsApi.getStartNode()
    this.currentRequest.session.flow_thread_id = uuid()
    return await this.getContentsByNode(startNode, resolvedLocale)
  }

  async getContentsByNode(
    node: HtNodeWithContent,
    locale: string,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const contents = prevContents || []
    const resolvedLocale = this.cmsApi.getResolvedLocale(locale)

    if (node.type === HtNodeWithContentType.FUNCTION) {
      const targetId = await this.callFunction(node, resolvedLocale)
      return this.getContentsById(targetId, resolvedLocale, contents)
    }

    const content = this.getFlowContent(node, resolvedLocale)
    if (content) {
      contents.push(content)
    }

    // If node is BOT_ACTION not add more contents to render, next nodes render after execute action
    if (node.type === HtNodeWithContentType.BOT_ACTION) {
      return contents
    }

    // TODO: prevent infinite recursive calls
    if (node.follow_up) {
      return this.getContentsById(node.follow_up.id, resolvedLocale, contents)
    }

    return contents
  }

  private getFlowContent(
    hubtypeContent: HtNodeComponent,
    locale: string
  ): FlowContent | undefined {
    switch (hubtypeContent.type) {
      case HtNodeWithContentType.TEXT:
        return FlowText.fromHubtypeCMS(hubtypeContent, locale, this.cmsApi)
      case HtNodeWithContentType.IMAGE:
        return FlowImage.fromHubtypeCMS(hubtypeContent, locale)
      case HtNodeWithContentType.CAROUSEL:
        return FlowCarousel.fromHubtypeCMS(hubtypeContent, locale, this.cmsApi)
      case HtNodeWithContentType.VIDEO:
        return FlowVideo.fromHubtypeCMS(hubtypeContent, locale)
      case HtNodeWithContentType.WHATSAPP_BUTTON_LIST:
        return FlowWhatsappButtonList.fromHubtypeCMS(
          hubtypeContent,
          locale,
          this.cmsApi
        )
      case HtNodeWithContentType.WHATSAPP_CTA_URL_BUTTON:
        return FlowWhatsappCtaUrlButtonNode.fromHubtypeCMS(
          hubtypeContent,
          locale,
          this.cmsApi
        )
      case HtNodeWithContentType.HANDOFF:
        return FlowHandoff.fromHubtypeCMS(hubtypeContent, locale, this.cmsApi)

      case HtNodeWithContentType.KNOWLEDGE_BASE:
        return FlowKnowledgeBase.fromHubtypeCMS(hubtypeContent)

      case HtNodeWithContentType.BOT_ACTION:
        return FlowBotAction.fromHubtypeCMS(hubtypeContent, locale, this.cmsApi)

      default:
        return undefined
    }
  }

  private async callFunction(
    functionNode: HtFunctionNode,
    locale: string
  ): Promise<string> {
    const functionNodeId = functionNode.id
    const functionArguments = this.getArgumentsByLocale(
      functionNode.content.arguments,
      locale
    )
    const nameValues = functionArguments.map(arg => {
      return { [arg.name]: arg.value }
    })

    const args = Object.assign(
      {
        request: this.currentRequest,
        results: functionNode.content.result_mapping.map(r => r.result),
      },
      ...nameValues
    )
    const functionResult =
      await this.functions[functionNode.content.action](args)
    // TODO define result_mapping per locale??
    const result = functionNode.content.result_mapping.find(
      r => r.result === functionResult
    )
    if (!result?.target) {
      throw new Error(
        `No result found for result_mapping for node with id: ${functionNodeId}`
      )
    }
    return result.target.id
  }

  private getArgumentsByLocale(
    args: HtFunctionArguments[],
    locale: string
  ): HtFunctionArgument[] {
    let resultArguments: HtFunctionArgument[] = []
    for (const arg of args) {
      if ('locale' in arg && arg.locale === locale) {
        resultArguments = [...resultArguments, ...arg.values]
      }
      if ('type' in arg) {
        resultArguments = [...resultArguments, arg]
      }
    }

    return resultArguments
  }

  getPayloadParams<T extends PayloadParamsBase>(payload: string): T {
    const payloadParams = JSON.parse(payload.split(SEPARATOR)[1] || '{}')
    return payloadParams
  }

  getFlowName(flowId: string): string {
    return this.cmsApi.getFlowName(flowId)
  }
}

export * from './action'
export { BOT_ACTION_PAYLOAD_PREFIX } from './constants'
export * from './content-fields'
export { trackFlowContent } from './tracking'
export {
  BotonicPluginFlowBuilderOptions,
  FlowBuilderJSONVersion,
  PayloadParamsBase,
} from './types'
export * from './webview'
