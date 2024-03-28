import { ActionRequest } from '@botonic/react'

import { BotonicQueue } from '../queue'

export interface BotonicDeskOptions {
  requestLimits?: RequestLimits
}
export interface CmsContext {
  locale: string
}

export interface RequestLimits {
  queues: string
}

export interface ApiDeskQueue {
  id: string
  name: string
  status: string
  project_id: string
}

export type CaseStatus =
  | 'status_attending'
  | 'status_waiting'
  | 'status_idle'
  | 'status_resolved'

// Check https://docs.api.hubtype.com/ for mor information about the parameters
export type GetDeskCaseListParams = {
  searchBy: string
  startDate?: Date
  endDate?: Date
  status?: CaseStatus[]
  provider?: string[]
  queueId?: string[]
  projectId?: string[]
  agentId?: string[]
  cursor?: string
  pageSize?: number
}

export interface DeskInterface {
  /** They cannot be set in constructor because it's botonic who creates the plugins */
  init(request: ActionRequest): void
  getQueueById(queueId: string, deskProjectId?: string): Promise<BotonicQueue>
  getQueueByName(
    queueName: string,
    deskProjectId?: string
  ): Promise<BotonicQueue>
  getAvailableAgentsByQueue(queueId: string): Promise<AvailableAgent[]>
  getAssignedAgentEmailByQueue(queue: BotonicQueue): Promise<string | undefined>
  getAssignedAgentByQueue(
    queue: BotonicQueue
  ): Promise<AvailableAgent | undefined>
  isAgentAvailableInQueue(agentEmail: string, queueId: string): Promise<boolean>
  getDeskCaseList(params: GetDeskCaseListParams): Promise<DeskCase[]>
}

export type Chat = {
  id: string
  created_at: string
  provider: string
  provider_account_id: string
  provider_id: string
  name: string
  username: string
  is_blocked: boolean
  is_banned: boolean
  is_online: boolean
  last_message_received: string
}

export interface DeskCase {
  id: string
  created_at: string
  status: string
  project_id: string
  queue_id: string
  chat: Chat
  provider: string
  description?: string
  assigned_to: Agent | null
  resolved_by: Agent | null
  resolved_at: string | null
  resolution_status: string | null
  has_agent_message: boolean
}
export interface Agent {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  status: string
}
export interface AvailableAgent {
  id: string
  email: string
  first_name: string
  last_name: string
  busy_rank: number
  attending_count: number
  idle_count: number
}

export interface DeskOptions {
  requestLimits?: RequestLimits
}
