import { Input, PluginPreRequest } from '@botonic/core'
import axios from 'axios'

import { REG_EXP_PATTERN, SEPARATOR } from './constants'
import {
  HtBotActionNode,
  HtFallbackNode,
  HtFlowBuilderData,
  HtGoToFlow,
  HtIntentNode,
  HtKeywordNode,
  HtNodeComponent,
  HtNodeLink,
  HtNodeWithContent,
  HtNodeWithContentType,
  HtNodeWithoutContentType,
  HtPayloadNode,
} from './content-fields/hubtype-fields'
import { HtSmartIntentNode } from './content-fields/hubtype-fields/smart-intent'
import { FlowBuilderApiOptions } from './types'

export class FlowBuilderApi {
  url: string
  flow: HtFlowBuilderData
  request: PluginPreRequest

  private constructor() {}

  static async create(options: FlowBuilderApiOptions): Promise<FlowBuilderApi> {
    const newApi = new FlowBuilderApi()

    newApi.url = options.url
    newApi.flow = options.flow ?? (await newApi.getFlow(options.accessToken))
    newApi.request = options.request

    return newApi
  }

  private async getFlow(token: string): Promise<HtFlowBuilderData> {
    const { data } = await axios.get(this.url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data as HtFlowBuilderData
  }

  getNodeByFlowId(id: string): HtNodeWithContent {
    const subFlow = this.flow.flows.find(subFlow => subFlow.id === id)
    if (!subFlow) throw Error(`SubFlow with id: '${id}' not found`)
    return this.getNodeById<HtNodeWithContent>(subFlow.start_node_id)
  }

  getNodeById<T extends HtNodeComponent>(id: string): T {
    const node = this.flow.nodes.find(node => node.id === id)
    if (!node) throw Error(`Node with id: '${id}' not found`)
    if (node.type === HtNodeWithoutContentType.GO_TO_FLOW) {
      return this.getNodeByFlowId(node.content.flow_id) as T
    }
    return node as T
  }

  getNodeByContentID(contentID: string): HtNodeComponent {
    const content = this.flow.nodes.find(node =>
      'code' in node ? node.code === contentID : false
    )
    if (!content) throw Error(`Node with contentID: '${contentID}' not found`)
    return content
  }

  getStartNode(): HtNodeWithContent {
    const startNodeId = this.flow.start_node_id
    if (!startNodeId) throw new Error('Start node id must be defined')
    return this.getNodeById(startNodeId)
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
      return this.getNodeById(fallbackFirstMessage.id)
    }
    return alternate
      ? this.getNodeById(fallbackFirstMessage.id)
      : this.getNodeById(fallbackSecondMessage.id)
  }

  getKnowledgeBaseConfig():
    | { followup?: HtNodeLink; isActive: boolean }
    | undefined {
    const fallbackNode = this.flow.nodes.find(
      node => node.type === HtNodeWithContentType.FALLBACK
    ) as HtFallbackNode | undefined

    return fallbackNode
      ? {
          followup: fallbackNode.content.knowledge_base_followup,
          isActive: fallbackNode.content.is_knowledge_base_active || false,
        }
      : undefined
  }

  getIntentNode(input: Input, locale: string): HtIntentNode | undefined {
    try {
      const intentsNodes = this.flow.nodes.filter(
        node => node.type === HtNodeWithContentType.INTENT
      ) as HtIntentNode[]
      const inputIntent = input.intent
      if (inputIntent) {
        return intentsNodes.find(
          node =>
            inputIntent && this.nodeContainsIntent(node, inputIntent, locale)
        )
      }
    } catch (error) {
      console.error(`Error getting node by intent '${input.intent}': `, error)
    }

    return undefined
  }

  getSmartIntentNodes(): HtSmartIntentNode[] {
    return this.flow.nodes.filter(
      node => node.type === HtNodeWithContentType.SMART_INTENT
    ) as HtSmartIntentNode[]
  }

  private nodeContainsIntent(
    node: HtIntentNode,
    intent: string,
    locale: string
  ): boolean {
    return node.content.intents.some(
      i => i.locale === locale && i.values.includes(intent)
    )
  }

  hasMetConfidenceThreshold(
    node: HtIntentNode,
    predictedConfidence: number
  ): boolean {
    const nodeConfidence = node.content.confidence / 100
    return predictedConfidence >= nodeConfidence
  }

  getNodeByKeyword(
    userInput: string,
    locale: string
  ): HtKeywordNode | undefined {
    try {
      const keywordNodes = this.flow.nodes.filter(
        node => node.type === HtNodeWithContentType.KEYWORD
      ) as HtKeywordNode[]
      const matchedKeywordNodes = keywordNodes.filter(node =>
        this.matchKeywords(node, userInput, locale)
      )
      if (matchedKeywordNodes.length > 0 && matchedKeywordNodes[0].target) {
        return matchedKeywordNodes[0]
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
      keywords =>
        keywords.locale === locale &&
        this.inputMatchesAnyKeyword(input, keywords.values)
    )
    return Boolean(result)
  }

  private inputMatchesAnyKeyword(input: string, keywords: string[]): boolean {
    return keywords.some(keyword => {
      const regExpMatchArray = keyword.match(REG_EXP_PATTERN)
      if (regExpMatchArray) {
        return this.resolveKeywordAsRegExp(regExpMatchArray, input)
      }
      return input.includes(keyword)
    })
  }

  private resolveKeywordAsRegExp(
    regExpMatchArray: RegExpMatchArray,
    input: string
  ) {
    const [, pattern, flags] = regExpMatchArray
    const keywordAsRegExp = new RegExp(pattern, flags)
    return input.match(keywordAsRegExp)
  }

  getPayload(target?: HtNodeLink): string | undefined {
    if (!target) {
      return undefined
    }

    if (target.type === HtNodeWithoutContentType.BOT_ACTION) {
      const botActionNode = this.getNodeById<HtBotActionNode>(target.id)
      return this.createPayloadWithParams(botActionNode)
    }

    return target.id
  }

  private createPayloadWithParams(botActionNode: HtBotActionNode): string {
    const payloadId = botActionNode.content.payload_id
    const payloadNode = this.getNodeById<HtPayloadNode>(payloadId)
    const customParams = JSON.parse(
      botActionNode.content.payload_params || '{}'
    )

    const followUpContentID = this.getFollowUpContentID(
      botActionNode.follow_up?.id
    )

    const payloadJson = JSON.stringify({
      ...customParams,
      followUpContentID,
    })
    return `${payloadNode.content.payload}${SEPARATOR}${payloadJson}`
  }

  private getFollowUpContentID(id?: string): string | undefined {
    const followUpNode = id
      ? this.getNodeById<HtNodeWithContent | HtGoToFlow>(id)
      : undefined

    if (followUpNode?.type === HtNodeWithoutContentType.GO_TO_FLOW) {
      return this.getNodeById<HtNodeWithContent>(followUpNode?.content.flow_id)
        .code
    } else {
      return followUpNode?.code
    }
  }

  getResolvedLocale(locale: string): string {
    if (this.flow.locales.find(flowLocale => flowLocale === locale)) {
      return locale
    }
    const language = locale.split('-')[0]
    if (this.flow.locales.find(flowLocale => flowLocale === language)) {
      console.log(`locale: ${locale} has been resolved as ${language}`)
      return language
    }
    throw new Error(
      `locale: ${locale} cannot be resolved in  ${this.flow.locales}`
    )
  }
}
