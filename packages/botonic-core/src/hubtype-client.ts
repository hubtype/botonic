import axios from 'axios'

import {
  type BotContext,
  BotonicAction,
  type BotonicActionType,
} from './models'

const HUBTYPE_API_URL = process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'
const TIMEOUT_MS = 10_000 // 10 seconds

export interface OpenQueuesResponse {
  queues: string[]
}

export interface StatusResponse {
  status: string
}

export interface AvailableAgentsByQueueResponse {
  agents: string[]
}

export interface AvailableAgentsResponse {
  agents: {
    attending_count: number
    email: string
    idle_count: number
    last_message_sent: string
    status: string
  }[]
}

interface GetVacationRangeArgs {
  agentId?: string
  agentEmail?: string
}

export interface AgentVacationRangesResponse {
  vacation_ranges: {
    end_date: number // timestamp
    id: number
    start_date: number // timestamp
  }[]
}

export class HubtypeClient {
  private readonly accessToken: string
  private readonly botContext: BotContext
  private readonly hubtypeApiUrl: string

  constructor(botContext: BotContext) {
    this.botContext = botContext
    this.accessToken = botContext.secrets?.HUBTYPE_ACCESS_TOKEN || ''
    this.hubtypeApiUrl = botContext.settings?.HUBTYPE_API_URL || HUBTYPE_API_URL
  }

  async getOpenQueues(): Promise<OpenQueuesResponse> {
    const response = await axios<OpenQueuesResponse>({
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: `${this.hubtypeApiUrl}/v1/queues/get_open_queues/`,
      data: { bot_id: this.botContext.session.bot.id },
      timeout: TIMEOUT_MS,
    })

    return response.data
  }

  async storeCaseRating(rating: number): Promise<StatusResponse> {
    const chatId = this.botContext.session.user.id
    const response = await axios<StatusResponse>({
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: `${this.hubtypeApiUrl}/v1/chats/${chatId}/store_case_rating/`,
      data: { chat_id: chatId, rating },
      timeout: TIMEOUT_MS,
    })

    return response.data
  }

  async getAvailableAgentsByQueue(
    queueId: string
  ): Promise<AvailableAgentsByQueueResponse> {
    const response = await axios<AvailableAgentsByQueueResponse>({
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'post',
      url: `${this.hubtypeApiUrl}/v1/queues/${queueId}/get_available_agents/`,
    })

    return response.data
  }

  async getAvailableAgents(): Promise<AvailableAgentsResponse> {
    const botId = this.botContext.session.bot.id
    const response = await axios<AvailableAgentsResponse>({
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: `${this.hubtypeApiUrl}/v1/bots/${botId}/get_agents/`,
    })

    return response.data
  }

  async getAgentVacationRanges({
    agentId,
    agentEmail,
  }: GetVacationRangeArgs): Promise<AgentVacationRangesResponse> {
    const botId = this.botContext.session.bot.id
    const response = await axios<AgentVacationRangesResponse>({
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
      url: `${this.hubtypeApiUrl}/v1/bots/${botId}/get_agent_vacation_ranges/`,
      params: { agent_id: agentId, agent_email: agentEmail },
    })

    return response.data
  }

  cancelHandoff(typification: string | null = null): void {
    let action: BotonicActionType = BotonicAction.DiscardCase
    if (typification) {
      action = `${action}:${JSON.stringify({ typification })}`
    }
    this.botContext.session._botonic_action = action
  }

  deleteUser(): void {
    this.botContext.session._botonic_action = BotonicAction.DeleteUser
  }
}
