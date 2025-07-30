import { PluginPreRequest } from '@botonic/core'
import axios from 'axios'
import {
  AI_AGENTS_FLOW_NAME,
  KNOWLEDGE_BASE_FLOW_NAME,
  SEPARATOR,
  UUID_REGEXP,
} from './constants'
import {
  HtBotActionNode,
  HtFallbackNode,
  HtFlowBuilderData,
  HtGoToFlow,
  HtKeywordNode,
  HtNodeComponent,
  HtNodeLink,
  HtNodeWithContent,
  HtNodeWithContentType,
  HtNodeWithoutContentType,
  HtPayloadNode,
  HtRatingButton,
  HtRatingNode,
} from './content-fields/hubtype-fields'
import { HtSmartIntentNode } from './content-fields/hubtype-fields/smart-intent'
import { FlowBuilderApiOptions, ProcessEnvNodeEnvs } from './types'

export class FlowBuilderApi {
  url: string
  flowUrl: string
  flow: HtFlowBuilderData
  request: PluginPreRequest

  private constructor() {}

  static async create(options: FlowBuilderApiOptions): Promise<FlowBuilderApi> {
    const newApi = new FlowBuilderApi()

    newApi.url = options.url
    newApi.request = options.request
    // TODO: Refactor later to combine logic from `FlowBuilderApi.create`, `resolveFlowUrl` and `getAccessToken` to be in one place
    if (process.env.NODE_ENV === ProcessEnvNodeEnvs.DEVELOPMENT) {
      await newApi.updateSessionWithUserInfo(options.accessToken)
    }
    const updatedRequest = newApi.request
    newApi.flowUrl = options.flowUrl.replace(
      '{bot_id}',
      updatedRequest.session.bot.id
    )
    newApi.flow = options.flow ?? (await newApi.getFlow(options.accessToken))
    return newApi
  }

  private async getFlow(token: string): Promise<HtFlowBuilderData> {
    const { data } = await axios.get(this.flowUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data as HtFlowBuilderData
  }

  private async updateSessionWithUserInfo(token: string) {
    const url = `${this.url}/v1/flow_builder/user_info/`
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    this.request.session.organization_id = response.data.organization_id
    this.request.session.bot.id = response.data.bot_id
  }

  getNodeByFlowId(id: string): HtNodeWithContent {
    const subFlow = this.flow.flows.find(subFlow => subFlow.id === id)
    if (!subFlow) throw Error(`SubFlow with id: '${id}' not found`)
    return this.getNodeById<HtNodeWithContent>(subFlow.start_node_id)
  }

  getNodeById<T extends HtNodeComponent>(id: string): T {
    const node = this.flow.nodes.find(node => node.id === id)
    if (!node) console.error(`Node with id: '${id}' not found`)
    if (node?.type === HtNodeWithoutContentType.GO_TO_FLOW) {
      return this.getNodeByFlowId(node.content.flow_id) as T
    }
    return node as T
  }

  getRatingNodeByButtonId(id: string): HtRatingNode {
    const ratingNodes = this.flow.nodes.filter(
      node => node.type === HtNodeWithContentType.RATING
    ) as HtRatingNode[]
    const ratingNode = ratingNodes.find(node =>
      node.content.buttons.some(button => button.id === id)
    ) as HtRatingNode | undefined

    if (!ratingNode) {
      throw Error(`Rating node with button id: '${id}' not found`)
    }

    return ratingNode
  }

  getRatingButtonById(ratingNode: HtRatingNode, id: string): HtRatingButton {
    const ratingButton = ratingNode.content.buttons.find(
      button => button.id === id
    ) as HtRatingButton | undefined
    if (!ratingButton) {
      throw Error(`Rating button with id: '${id}' not found`)
    }

    return ratingButton
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

  getSmartIntentNodes(): HtSmartIntentNode[] {
    return this.flow.nodes.filter(
      node => node.type === HtNodeWithContentType.SMART_INTENT
    ) as HtSmartIntentNode[]
  }

  getKeywordNodes(): HtKeywordNode[] {
    return this.flow.nodes.filter(
      node => node.type === HtNodeWithContentType.KEYWORD
    ) as HtKeywordNode[]
  }

  getPayload(target?: HtNodeLink): string | undefined {
    if (!target) {
      return undefined
    }

    return target.id
  }

  isBotAction(id: string): boolean {
    if (!this.isUUID(id)) {
      return false
    }
    const node = this.getNodeById(id)
    return node?.type === HtNodeWithContentType.BOT_ACTION
  }

  private isUUID(str: string): boolean {
    return UUID_REGEXP.test(str)
  }

  createPayloadWithParams(botActionNode: HtBotActionNode): string {
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

  getFlowName(flowId: string): string {
    const flow = this.flow.flows.find(flow => flow.id === flowId)
    return flow ? flow.name : ''
  }

  getStartNodeKnowledgeBaseFlow(): HtNodeWithContent | undefined {
    const knowledgeBaseFlow = this.flow.flows.find(
      flow => flow.name === KNOWLEDGE_BASE_FLOW_NAME
    )
    if (!knowledgeBaseFlow) {
      return undefined
    }
    return this.getNodeById<HtNodeWithContent>(knowledgeBaseFlow.start_node_id)
  }

  getStartNodeAiAgentFlow(): HtNodeWithContent | undefined {
    const aiAgentFlow = this.flow.flows.find(
      flow => flow.name === AI_AGENTS_FLOW_NAME
    )

    if (!aiAgentFlow) {
      return undefined
    }

    return this.getNodeById<HtNodeWithContent>(aiAgentFlow.start_node_id)
  }

  isKnowledgeBaseEnabled(): boolean {
    return this.flow.is_knowledge_base_active || false
  }

  isAiAgentEnabled(): boolean {
    return this.flow.is_ai_agent_active || false
  }

  getResolvedLocale(): string {
    const systemLocale = this.request.getSystemLocale()

    const locale = this.resolveAsLocale(systemLocale)
    if (locale) {
      return locale
    }

    const language = this.resolveAsLanguage(systemLocale)
    if (language) {
      this.request.setSystemLocale(language)
      return language
    }

    const defaultLocale = this.resolveAsDefaultLocale()
    this.request.setSystemLocale(defaultLocale)
    return defaultLocale
  }

  private resolveAsLocale(locale: string): string | undefined {
    if (this.flow.locales.find(flowLocale => flowLocale === locale)) {
      return locale
    }
    return undefined
  }

  private resolveAsLanguage(locale?: string): string | undefined {
    const language = locale?.split('-')[0]
    if (
      language &&
      this.flow.locales.find(flowLocale => flowLocale === language)
    ) {
      console.log(`locale: ${locale} has been resolved as ${language}`)
      return language
    }
    return undefined
  }

  private resolveAsDefaultLocale(): string {
    console.log(
      `Resolve locale with default locale: ${this.flow.default_locale_code}`
    )
    return this.flow.default_locale_code || 'en'
  }

  async updateContactInfo(
    token: string,
    lastMessageId: string,
    memory_length: number = 10
  ): Promise<Record<string, any>> {
    const url = `${this.url}/external/v1/entities/synchronize/`
    const params = {
      last_message_id: lastMessageId,
      memory_length: memory_length,
    }
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    return (data['entities'] || []).reduce(
      (acc, entity) => {
        acc[entity.name] = entity.value
        return acc
      },
      {} as Record<string, any>
    )
  }
}
