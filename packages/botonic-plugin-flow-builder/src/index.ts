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
  FallbackNode,
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
import { updateButtonUrls } from './helpers'
import { BotonicPluginFlowBuilderOptions } from './types'
import { resolveGetAccessToken } from './utils'

export default class BotonicPluginFlowBuilder implements Plugin {
  private flowUrl: string
  private flow: Promise<FlowBuilderData> | FlowBuilderData
  private functions: Record<any, any>
  private currentRequest: PluginPreRequest
  private getAccessToken: (session: Session) => string
  public getLocale: (session: Session) => string

  constructor(readonly options: BotonicPluginFlowBuilderOptions) {
    this.getLocale = options.getLocale
    this.getAccessToken = resolveGetAccessToken(options)
    this.flowUrl = options.flowUrl
    if (options.flow) this.flow = options.flow
    const customFunctions = options.customFunctions || {}
    this.functions = { ...DEFAULT_FUNCTIONS, ...customFunctions }
  }

  async readFlowContent(session: Session): Promise<FlowBuilderData> {
    const { data } = await axios.get(this.flowUrl, {
      headers: { Authorization: `Bearer ${this.getAccessToken(session)}` },
    })
    return data
  }

  async pre(request: PluginPreRequest): Promise<void> {
    this.currentRequest = request
    this.flow = await this.readFlowContent(this.currentRequest.session)
  }

  async post(_request: PluginPostRequest): Promise<void> {}

  async getContent(id: string): Promise<NodeComponent> {
    const flow = await this.flow
    const content = flow.nodes.find(node => node.id === id)
    if (!content) throw Error(`Node with id: '${id}' not found`)
    return content
  }

  async getHandoffContent(
    handoffTargetId: string | undefined
  ): Promise<HandoffNode> {
    const flow = await this.flow
    const content = flow.nodes.find(
      node => node.id === handoffTargetId
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
    const startNode = flow.nodes.find(
      node => node.type === NodeType.START_UP
    ) as StartNode | undefined
    if (!startNode) throw new Error('start-up id must be defined')
    return startNode.target.id
  }

  async getFallbackId(alternate: boolean): Promise<string> {
    const flow = await this.flow
    const fallbackNode = flow.nodes.find(
      node => node.type === NodeType.FALLBACK
    ) as FallbackNode | undefined
    if (!fallbackNode) throw new Error('fallback node must be defined')
    const fallbackFirstMessage = fallbackNode.content.first_message
    const fallbackSecondMessage = fallbackNode.content.second_message
    if (!fallbackSecondMessage) return fallbackFirstMessage.id
    return alternate ? fallbackFirstMessage.id : fallbackSecondMessage.id
  }
  async getContents(
    id: string,
    locale: string,
    prevContents?: FlowContent[]
  ): Promise<{ contents: FlowContent[]; handoffNode: HandoffNode }> {
    const contents = prevContents || []
    const hubtypeContent: any = await this.getContent(id)
    const isHandoff = hubtypeContent.type === NodeType.HANDOFF
    // TODO: Create function to populate these buttons
    await updateButtonUrls(hubtypeContent, 'elements', this.getContent)
    await updateButtonUrls(hubtypeContent, 'buttons', this.getContent)
    const content = await this.getFlowContent(hubtypeContent, locale)

    if (content && 'buttons' in content) {
      content.buttons.forEach(async button => {
        if (button.payload) {
          const contentButton = await this.getContent(button.payload)
          if (contentButton?.type === NodeType.PAYLOAD) {
            button.payload = contentButton.content.payload
          }
        }
      })
    }

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
    return { contents, handoffNode: isHandoff && hubtypeContent }
  }

  async getPayloadByIntent(
    input: Input,
    locale: string
  ): Promise<string | undefined> {
    try {
      const flow = await this.flow
      const intents = flow.nodes.filter(
        node => node.type === NodeType.INTENT
      ) as IntentNode[]
      const inputIntent = input.intent
      const inputConfidence = input.confidence
      if (inputIntent) {
        const matchedIntentNode = intents.find(
          node =>
            inputIntent &&
            this.hasIntent(node, inputIntent, locale) &&
            inputConfidence &&
            this.hasMetConfidenceThreshold(node, inputConfidence)
        )
        return matchedIntentNode?.target?.id
      }
    } catch (error) {
      console.error('Error getting payload by input: ', error)
    }

    return undefined
  }

  hasIntent(node: IntentNode, intent: string, locale: string): boolean {
    return node.content.intents.some(
      i => i.locale === locale && i.values.includes(intent)
    )
  }

  hasMetConfidenceThreshold(
    node: IntentNode,
    predictedConfidence: number
  ): boolean {
    const nodeConfidence = node.content.confidence / 100
    return predictedConfidence >= nodeConfidence
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
    const nameValues =
      functionNode.content.arguments
        .find(arg => arg.locale === locale)
        ?.values.map(value => ({ [value.name]: value.value })) || []

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
