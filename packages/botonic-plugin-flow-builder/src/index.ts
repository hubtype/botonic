import { Plugin, PluginPreRequest, Session } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { getNodeByUserInput } from './action/user-input'
import { FlowBuilderApi } from './api'
import { SEPARATOR, SOURCE_INFO_SEPARATOR } from './constants'
import {
  FlowCarousel,
  FlowContent,
  FlowHandoff,
  FlowImage,
  FlowText,
  FlowVideo,
  FlowWhatsappButtonList,
} from './content-fields'
import {
  HtFlowBuilderData,
  HtFunctionNode,
  HtNodeComponent,
  HtNodeWithContent,
  HtNodeWithContentType,
} from './content-fields/hubtype-fields'
import { DEFAULT_FUNCTIONS } from './functions'
import {
  BotonicPluginFlowBuilderOptions,
  KnowledgeBaseResponse,
  PayloadParamsBase,
} from './types'
import { resolveGetAccessToken } from './utils'

export default class BotonicPluginFlowBuilder implements Plugin {
  public cmsApi: FlowBuilderApi
  private flowUrl: string
  private flow?: HtFlowBuilderData
  private functions: Record<any, any>
  private currentRequest: PluginPreRequest
  private getAccessToken: (session: Session) => string
  public getLocale: (session: Session) => string
  public trackEvent?: (
    request: ActionRequest,
    eventName: string,
    args?: Record<string, any>
  ) => Promise<void>
  public getKnowledgeBaseResponse?: (
    request: ActionRequest
  ) => Promise<KnowledgeBaseResponse>

  constructor(readonly options: BotonicPluginFlowBuilderOptions) {
    this.flowUrl = options.flowUrl
    this.flow = options.flow
    this.getLocale = options.getLocale
    this.getAccessToken = resolveGetAccessToken(options)
    this.trackEvent = options.trackEvent
    this.getKnowledgeBaseResponse = options.getKnowledgeBaseResponse
    const customFunctions = options.customFunctions || {}
    this.functions = { ...DEFAULT_FUNCTIONS, ...customFunctions }
  }

  async pre(request: PluginPreRequest): Promise<void> {
    this.currentRequest = request
    this.cmsApi = await FlowBuilderApi.create({
      url: this.flowUrl,
      flow: this.flow,
      accessToken: this.getAccessToken(request.session),
      request: this.currentRequest,
    })

    const checkUserTextInput =
      request.input.data &&
      !request.input.payload &&
      !request.session.is_first_interaction

    if (checkUserTextInput) {
      const nodeByUserInput = await getNodeByUserInput(
        this.cmsApi,
        this.getLocale(request.session),
        request as unknown as ActionRequest
      )
      request.input.payload = this.cmsApi.getPayload(nodeByUserInput?.target)
    }

    if (request.input.payload) {
      request.input.payload = request.input.payload?.split(
        SOURCE_INFO_SEPARATOR
      )[0]
    }
  }

  async getContentsByCode(
    code: string,
    locale: string,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const node = this.cmsApi.getNodeByCode(code) as HtNodeWithContent
    return await this.getContentsByNode(node, locale, prevContents)
  }

  async getContentsById(
    id: string,
    locale: string,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const node = this.cmsApi.getNodeById(id) as HtNodeWithContent
    return await this.getContentsByNode(node, locale, prevContents)
  }

  async getStartContents(locale: string): Promise<FlowContent[]> {
    const startNode = this.cmsApi.getStartNode()
    return await this.getContentsByNode(startNode, locale)
  }

  async getContentsByNode(
    node: HtNodeWithContent,
    locale: string,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const contents = prevContents || []

    const content = this.getFlowContent(node, locale)

    if (node.type === HtNodeWithContentType.FUNCTION) {
      const targetId = await this.callFunction(node, locale)
      return this.getContentsById(targetId, locale, contents)
    } else {
      if (content) contents.push(content)
      // TODO: prevent infinite recursive calls

      if (node.follow_up)
        return this.getContentsById(node.follow_up.id, locale, contents)
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
        return FlowWhatsappButtonList.fromHubtypeCMS(hubtypeContent, locale)
      case HtNodeWithContentType.HANDOFF:
        return FlowHandoff.fromHubtypeCMS(hubtypeContent, locale, this.cmsApi)
      default:
        return undefined
    }
  }

  async callFunction(
    functionNode: HtFunctionNode,
    locale: string
  ): Promise<string> {
    const functionNodeId = functionNode.id
    const nameValues =
      functionNode.content.arguments
        .find(arg => arg.locale === locale)
        ?.values.map(value => ({ [value.name]: value.value })) || []

    const args = Object.assign(
      {
        request: this.currentRequest,
        results: functionNode.content.result_mapping.map(r => r.result),
      },
      ...nameValues
    )
    const functionResult = await this.functions[functionNode.content.action](
      args
    )
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

  getPayloadParams<T extends PayloadParamsBase>(payload: string): T {
    const payloadParams = JSON.parse(payload.split(SEPARATOR)[1] || '{}')
    return payloadParams
  }
}

export * from './action'
export * from './content-fields'
export { BotonicPluginFlowBuilderOptions, PayloadParamsBase } from './types'
