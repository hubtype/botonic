import {
  Plugin,
  PluginPostRequest,
  PluginPreRequest,
  Session,
} from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from './api'
import {
  FlowCarousel,
  FlowContent,
  FlowImage,
  FlowText,
  FlowVideo,
  FlowWhatsappButtonList,
} from './content-fields'
import {
  HtFunctionNode,
  HtHandoffNode,
  HtNodeComponent,
  HtNodeWithContent,
  HtNodeWithContentType,
} from './content-fields/hubtype-fields'
import { DEFAULT_FUNCTIONS } from './functions'
import { isHandoffNode } from './helpers'
import { BotonicPluginFlowBuilderOptions } from './types'
import { resolveGetAccessToken } from './utils'

export default class BotonicPluginFlowBuilder implements Plugin {
  public cmsApi: FlowBuilderApi
  private functions: Record<any, any>
  private currentRequest: PluginPreRequest
  private getAccessToken: (session: Session) => string
  public getLocale: (session: Session) => string
  public trackEvent?: (
    request: ActionRequest,
    eventName: string,
    args?: Record<string, any>
  ) => Promise<void>

  constructor(readonly options: BotonicPluginFlowBuilderOptions) {
    this.cmsApi = new FlowBuilderApi({
      url: options.flowUrl,
      flow: options.flow,
    })
    this.getLocale = options.getLocale
    this.getAccessToken = resolveGetAccessToken(options)
    this.trackEvent = options.trackEvent
    const customFunctions = options.customFunctions || {}
    this.functions = { ...DEFAULT_FUNCTIONS, ...customFunctions }
  }

  async pre(request: PluginPreRequest): Promise<void> {
    this.currentRequest = request
    await this.cmsApi.init(this.getAccessToken(request.session))
  }

  async post(_request: PluginPostRequest): Promise<void> {}

  async getContent(
    nodeOrId: HtNodeWithContent | string,
    locale: string,
    prevContents?: FlowContent[]
  ): Promise<{ contents: FlowContent[]; handoffNode?: HtHandoffNode }> {
    const contents = prevContents || []
    let node = nodeOrId as HtNodeWithContent
    if (typeof nodeOrId === 'string') {
      node = this.cmsApi.getNode(nodeOrId) as HtNodeWithContent
    }

    const content = await this.getFlowContent(node, locale)

    if (node.type === HtNodeWithContentType.FUNCTION) {
      const targetId = await this.callFunction(node, locale)
      return this.getContent(targetId, locale, contents)
    } else {
      if (content) contents.push(content)
      // TODO: prevent infinite recursive calls

      if (node.follow_up)
        return this.getContent(node.follow_up.id, locale, contents)
    }

    return { contents, handoffNode: isHandoffNode(node) ? node : undefined }
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
        results: [functionNode.content.result_mapping.map(r => r.result)],
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
}

export * from './action'
