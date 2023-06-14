import { Input } from '@botonic/core'
import axios from 'axios/index'

import {
  HtFallbackNode,
  HtFlowBuilderData,
  HtIntentNode,
  HtKeywordNode,
  HtNodeComponent,
  HtNodeStartType,
  HtNodeWithContent,
  HtNodeWithContentType,
  HtStartNode,
} from './content-fields/hubtype-fields'
import { FlowBuilderApiOptions } from './types'

export class FlowBuilderApi {
  private readonly url: string
  public flow: HtFlowBuilderData

  constructor(options: FlowBuilderApiOptions) {
    this.url = options.url
    if (options.flow) {
      this.flow = options.flow
    }
  }

  async init(token: string) {
    const { data } = await axios.get(this.url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    this.flow = data
  }

  getNode<T extends HtNodeComponent>(id: string): T {
    const node = this.flow.nodes.find(node => node.id === id)
    if (!node) throw Error(`Node with id: '${id}' not found`)
    return node as T
  }

  getNodeByCode(code: string): HtNodeComponent {
    const content = this.flow.nodes.find(node =>
      'code' in node ? node.code === code : false
    )
    if (!content) throw Error(`Node with code: '${code}' not found`)
    return content
  }

  getStartNode(): HtNodeWithContent {
    const startUpNode = this.flow.nodes.find(
      node => node.type === HtNodeStartType.STARTUP
    ) as HtStartNode | undefined
    if (!startUpNode) throw new Error('Start-up id must be defined')
    return this.getNode(startUpNode.target.id)
  }

  getFallbackNode(alternate: boolean): HtNodeWithContent {
    const fallbackNode = this.flow.nodes.find(
      node => node.type === HtNodeWithContentType.FALLBACK
    ) as HtFallbackNode | undefined
    if (!fallbackNode) {
      throw new Error('Fallback node must be defined')
    }
    const fallbackFirstMessage = fallbackNode.content.first_message
    if (!fallbackFirstMessage) {
      throw new Error('Fallback 1st message must be defined')
    }
    const fallbackSecondMessage = fallbackNode.content.second_message
    if (!fallbackSecondMessage) {
      return this.getNode(fallbackFirstMessage.id)
    }
    return alternate
      ? this.getNode(fallbackFirstMessage.id)
      : this.getNode(fallbackSecondMessage.id)
  }

  getNodeByIntent(input: Input, locale: string): HtNodeWithContent | undefined {
    try {
      const intents = this.flow.nodes.filter(
        node => node.type === HtNodeWithContentType.INTENT
      ) as HtIntentNode[]
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
        return (
          matchedIntentNode?.target &&
          this.getNode<HtNodeWithContent>(matchedIntentNode?.target.id)
        )
      }
    } catch (error) {
      console.error(`Error getting node by intent '${input.intent}': `, error)
    }

    return undefined
  }

  private hasIntent(
    node: HtIntentNode,
    intent: string,
    locale: string
  ): boolean {
    return node.content.intents.some(
      i => i.locale === locale && i.values.includes(intent)
    )
  }

  private hasMetConfidenceThreshold(
    node: HtIntentNode,
    predictedConfidence: number
  ): boolean {
    const nodeConfidence = node.content.confidence / 100
    return predictedConfidence >= nodeConfidence
  }

  getNodeByKeyword(
    userInput: string,
    locale: string
  ): HtNodeWithContent | undefined {
    try {
      const keywordNodes = this.flow.nodes.filter(
        node => node.type == HtNodeWithContentType.KEYWORD
      ) as HtKeywordNode[]
      const matchedKeywordNodes = keywordNodes.filter(node =>
        this.matchKeywords(node, userInput, locale)
      )
      if (matchedKeywordNodes.length > 0 && matchedKeywordNodes[0].target) {
        return this.getNode<HtNodeWithContent>(matchedKeywordNodes[0].target.id)
      }
    } catch (error) {
      console.error(`Error getting node by keyword '${userInput}': `, error)
    }

    return undefined
  }

  private matchKeywords(
    node: HtKeywordNode,
    input: string,
    locale: string
  ): boolean {
    const result = node.content.keywords.find(
      i => i.locale === locale && this.containsAnyKeywords(input, i.values)
    )
    return Boolean(result)
  }

  private containsAnyKeywords(input: string, keywords: string[]): boolean {
    for (let i = 0; i < keywords.length; i++) {
      if (input.includes(keywords[i])) {
        return true
      }
    }
    return false
  }
}
