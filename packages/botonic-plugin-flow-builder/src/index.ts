import {
  Input,
  Plugin,
  PluginPostRequest,
  PluginPreRequest,
  Session,
} from '@botonic/core'
import axios from 'axios'

import {
  FlowCarousel,
  FlowContent,
  FlowImage,
  FlowText,
  FlowVideo,
} from './content-fields'
import {
  FlowBuilderData,
  FunctionNode,
  HandoffNode,
  IntentNode,
  KeywordNode,
  NodeComponent,
  NodeType,
  StartNode,
} from './flow-builder-models'
import { DEFAULT_FUNCTIONS } from './functions'

export type BotonicPluginFlowBuilderOptions = {
  flowUrl: string
  flow?: FlowBuilderData
  customFunctions?: Record<any, any>
  getLocale: (session: Session) => string
  getAccessToken: () => string
}

export default class BotonicPluginFlowBuilder implements Plugin {
  private flowUrl: string
  private flow: Promise<FlowBuilderData> | FlowBuilderData
  private functions: Record<any, any>
  private currentRequest: PluginPreRequest
  private getAccessToken: () => string
  public getLocale: (session: Session) => string

  constructor(readonly options: BotonicPluginFlowBuilderOptions) {
    this.getLocale = options.getLocale
    this.getAccessToken = options.getAccessToken
    this.flowUrl = options.flowUrl
    this.flow = options.flow || this.readFlowContent()
    const customFunctions = options.customFunctions || {}
    this.functions = { ...DEFAULT_FUNCTIONS, ...customFunctions }
  }

  async readFlowContent(): Promise<FlowBuilderData> {
    const { data } = await axios.get(this.flowUrl, {
      headers: { Authorization: `Bearer ${this.getAccessToken()}` },
    })
    return data
  }

  async pre(request: PluginPreRequest): Promise<void> {
    this.currentRequest = request
    this.flow = this.readFlowContent()
  }

  async post(_request: PluginPostRequest): Promise<void> {}

  async getContent(id: string): Promise<NodeComponent> {
    const flow = await this.flow
    const content = flow.nodes.find(node => node.id === id)
    if (!content) throw Error(`Node with id: '${id}' not found`)
    return content
  }

  async getHandoffContent(): Promise<HandoffNode> {
    const flow = await this.flow
    const content = flow.nodes.find(
      node => node.type === NodeType.HANDOFF
    ) as HandoffNode
    if (!content) throw Error(`Handoff node not found`)
    return content
  }

  getFlowContent(
    hubtypeContent: NodeComponent,
    locale: string
  ): FlowContent | undefined {
    switch (hubtypeContent.type) {
      case NodeType.TEXT:
        return FlowText.fromHubtypeCMS(hubtypeContent, locale)
      case NodeType.IMAGE:
        return FlowImage.fromHubtypeCMS(hubtypeContent, locale)
      case NodeType.CAROUSEL:
        return FlowCarousel.fromHubtypeCMS(hubtypeContent, locale)
      case NodeType.VIDEO:
        return FlowVideo.fromHubtypeCMS(hubtypeContent, locale)
      default:
        return undefined
    }
  }

  async getStartId(): Promise<string> {
    const flow = await this.flow
    const startNode = flow.nodes.find(node => node.type === NodeType.START_UP)
    if (!startNode) {
      throw new Error('start-up id must be defined')
    }
    return (startNode as StartNode).target.id
  }

  async getContents(
    id: string,
    locale: string,
    prevContents?: FlowContent[]
  ): Promise<FlowContent[]> {
    const contents = prevContents || []
    const hubtypeContent: any = await this.getContent(id)
    if (hubtypeContent.content.elements) {
      for (const i in hubtypeContent.content.elements) {
        const button = hubtypeContent.content.elements[i].button
        if (button.url) {
          for (const j in button.url) {
            button.url[j] = {
              ...button.url[j],
              ...(await this.getContent(button.url[j].id)),
            }
          }
        }
      }
    }
    if (hubtypeContent.content.buttons) {
      for (const i in hubtypeContent.content.buttons) {
        const button = hubtypeContent.content.buttons[i]
        if (button.url) {
          for (const j in button.url) {
            button.url[j] = {
              ...button.url[j],
              ...(await this.getContent(button.url[j].id)),
            }
          }
        }
      }
    }
    const content = await this.getFlowContent(hubtypeContent, locale)
    if (hubtypeContent.type === NodeType.FUNCTION) {
      const targetId = await this.callFunction(hubtypeContent, locale)
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
        node => node.type === NodeType.INTENT
      ) as IntentNode[]
      if (input.intent) {
        const matchedIntentNode = intents.find(
          node =>
            //@ts-ignore
            this.hasIntent(node, input.intent, locale) &&
            //@ts-ignore
            this.hasMetConfidenceThreshold(node, input.confidence)
        )
        if (!matchedIntentNode) return undefined
        return matchedIntentNode.target?.id
      }
    } catch (error) {
      console.error('Error getting payload by input: ', error)
    }

    return undefined
  }

  hasIntent(node: IntentNode, intent: string, locale: string): boolean {
    const intentFound = node.content.intents.find(
      i => i.locale === locale && i.values.includes(intent)
    )
    if (!intentFound) return false
    return true
  }

  hasMetConfidenceThreshold(
    node: IntentNode,
    predictedConfidence: number
  ): boolean {
    const nodeConfidence = node.content.confidence / 100
    const metsConfidenceThreshold = predictedConfidence >= nodeConfidence
    if (!metsConfidenceThreshold) return false
    return true
  }

  async getPayloadByKeyword(
    input: Input,
    locale: string
  ): Promise<string | undefined> {
    try {
      const flow = await this.flow
      const keywordNodes = flow.nodes.filter(
        node => node.type == NodeType.KEYWORD
      ) as KeywordNode[]
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

  matchKeywords(node: KeywordNode, input: string, locale: string): boolean {
    const result = node.content.keywords.find(
      i => i.locale === locale && this.containsAnyKeywords(input, i.values)
    )
    return Boolean(result)
  }

  containsAnyKeywords(input: string, keywords: string[]): boolean {
    for (let i = 0; i < keywords.length; i++) {
      if (input.includes(keywords[i])) {
        return true
      }
    }
    return false
  }

  async callFunction(
    functionNode: FunctionNode,
    locale: string
  ): Promise<string> {
    const functionNodeId = functionNode.id
    const nameValues = functionNode.content.arguments
      .find(arg => arg.locale === locale)
      ?.values.map(value => ({ [value.name]: value.value }))
    if (!nameValues) {
      throw new Error(`No arguments found for node with id ${functionNodeId}`)
    }
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
    if (!result) {
      throw new Error(
        `No result found for result_mapping for node with id: ${functionNodeId}`
      )
    }
    return result.target.id
  }
}

export { FlowBuilderAction } from './action'
