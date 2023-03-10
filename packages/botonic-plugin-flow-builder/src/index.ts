import {
  Input,
  Plugin,
  PluginPostRequest,
  PluginPreRequest,
  Session,
} from '@botonic/core'
import axios from 'axios'

import { FlowCarousel } from './content-fields/carousel'
import { FlowContent } from './content-fields/content-base'
import { FlowImage } from './content-fields/image'
import { FlowText } from './content-fields/text'
import { DEFAULT_FUNCTIONS } from './functions'
import {
  HtBase,
  HtBaseNode,
  HtFlowBuilderData,
  HtFunctionNode,
  HtHandoffNode,
  HtIntentNode,
  HtKeywordNode,
  HtNodeComponent,
  HtStartReference,
  MessageContentType,
  StartFieldsType,
} from './hubtype-models'

export type BotonicPluginFlowBuilderOptions = {
  flowUrl: string
  flow?: any
  customFunctions?: Record<any, any>
  getLocale: () => string
  getAccessToken: () => string
}

export default class BotonicPluginFlowBuilder implements Plugin {
  private flowUrl: string
  private flow: Promise<HtFlowBuilderData>
  private functions: Record<any, any>
  private currentRequest: PluginPreRequest
  private getAccessToken: () => string
  public getLocale: () => string

  constructor(readonly options: BotonicPluginFlowBuilderOptions) {
    this.getLocale = options.getLocale
    this.getAccessToken = options.getAccessToken
    this.flowUrl = options.flowUrl
    this.flow = options.flow || this.readFlowContent()
    const customFunctions = options.customFunctions || {}
    this.functions = { ...DEFAULT_FUNCTIONS, ...customFunctions }
  }

  async readFlowContent() {
    const response = await axios.get(this.flowUrl, {
      headers: { Authorization: `Bearer ${this.getAccessToken()}` },
    })
    const data = response.data
    //@ts-ignore
    return data as HtFlowBuilderData
  }

  async pre(request: PluginPreRequest): Promise<void> {
    this.currentRequest = request
    this.flow = this.readFlowContent()
  }

  async post(_request: PluginPostRequest): Promise<void> {}

  async getContent(id: string): Promise<HtNodeComponent> {
    const flow = await this.flow
    const content = flow.nodes.find((c: HtBaseNode) => c.id === id)
    if (!content) throw Error(`text with id: '${id}' not found`)
    return content
  }

  async getHandoffContent(): Promise<HtHandoffNode> {
    const flow = await this.flow
    const content = flow.nodes.find(
      (c: HtNodeComponent) => c.type === 'handoff'
    ) as HtHandoffNode
    if (!content) throw Error(`Handoff node not found`)
    return content
  }

  getFlowContent(
    hubtypeContent: HtNodeComponent,
    locale: string
  ): FlowContent | undefined {
    switch (hubtypeContent.type) {
      case MessageContentType.TEXT:
        return FlowText.fromHubtypeCMS(hubtypeContent, locale)
      case MessageContentType.IMAGE:
        return FlowImage.fromHubtypeCMS(hubtypeContent, locale)
      case MessageContentType.CAROUSEL:
        return FlowCarousel.fromHubtypeCMS(hubtypeContent, locale)
      default:
        return undefined
    }
  }

  async getStartId(): Promise<string> {
    const flow = await this.flow

    const startNode = flow.nodes.find(
      (node: HtBase) => node?.type === StartFieldsType.START_UP
    )
    if (!startNode) {
      throw new Error('start-up id must be defined')
    }

    return (startNode as HtStartReference).target.id
  }

  async getContents(
    id: string,
    locale: string,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const contents = prevContents || []
    const hubtypeContent = await this.getContent(id)
    const content = await this.getFlowContent(hubtypeContent, locale)
    if (hubtypeContent.type === MessageContentType.FUNCTION) {
      const targetId = await this.callFunction(
        hubtypeContent as HtFunctionNode,
        locale
      )
      return this.getContents(targetId, locale, contents)
    } else {
      if (content) contents.push(content)
      // TODO: prevent infinite recursive calls
      if (hubtypeContent.follow_up)
        return this.getContents(hubtypeContent.follow_up.id, locale, contents)
    }
    // execute function
    // return this.getContents(function result_mapping target, locale, contents)
    return contents
  }

  async getPayloadByInput(
    input: Input,
    locale: string
  ): Promise<string | undefined> {
    try {
      const flow = await this.flow
      const intents = flow.nodes.filter(
        node => node.type === MessageContentType.INTENT
      ) as HtIntentNode[]
      if (input.intent) {
        const matchedIntents = intents.filter(node =>
          //@ts-ignore
          this.hasIntent(node, input.intent, locale)
        )
        if (matchedIntents.length > 0) {
          return matchedIntents[0].target?.id
        }
      }
    } catch (error) {
      console.error('Error getting payload by input: ', error)
    }

    return undefined
  }

  hasIntent(node: HtIntentNode, intent: string, locale: string) {
    const result = node.content.intents.find(
      i => i.locale === locale && i.values.includes(intent)
    )
    return Boolean(result)
  }

  async getPayloadByKeyword(
    input: Input,
    locale: string
  ): Promise<string | undefined> {
    try {
      const flow = await this.flow
      const keywordNodes = flow.nodes.filter(
        node => node.type == MessageContentType.KEYWORD
      ) as HtKeywordNode[]
      const matchedKeywordNodes = keywordNodes.filter(node =>
        //@ts-ignore
        this.matchKeywords(node, input.data, locale)
      )
      if (matchedKeywordNodes.length > 0) {
        return matchedKeywordNodes[0].target?.id
      }
    } catch (error) {
      console.error('Error getting payload by input: ', error)
    }

    return undefined
  }

  matchKeywords(node: HtKeywordNode, input: string, locale: string) {
    const result = node.content.keywords.find(
      i => i.locale === locale && this.containsAnyKeywords(input, i.values)
    )
    return Boolean(result)
  }

  containsAnyKeywords(input: string, keywords: string[]) {
    for (let i = 0; i < keywords.length; i++) {
      if (input.includes(keywords[i])) {
        return true
      }
    }
    return false
  }

  async callFunction(
    functionNode: HtFunctionNode,
    locale: string
  ): Promise<string> {
    // Check if target is missing or missing arguments
    // TODO: get arguments by locale
    const nameValues = functionNode.content.arguments
      .find(arg => arg.locale === locale)
      .values.map(value => ({ [value.name]: value.value }))
    const args = Object.assign(
      {
        session: this.currentRequest.session,
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
    return result.target.id
  }
}
