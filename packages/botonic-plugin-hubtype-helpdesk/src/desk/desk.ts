import { HubtypeSession } from '@botonic/core'
import { ActionRequest } from '@botonic/react'
import axios from 'axios'

import { BotonicQueue } from '../queue'
import {
  ApiDeskQueue,
  AvailableAgent,
  DeskCase,
  DeskInterface,
  DeskOptions,
  GetDeskCaseListParams,
  RequestLimits,
} from './types'

const BASE_URL = 'https://api.hubtype.com'
const DEFAULT_REQUEST_LIMITS: RequestLimits = {
  queues: '200',
}

export class Desk implements DeskInterface {
  private session!: HubtypeSession
  private readonly requestLimits: RequestLimits

  static getDesk(
    request: ActionRequest,
    options: DeskOptions | { desk: DeskInterface } = {}
  ): DeskInterface {
    const desk = 'desk' in options ? options.desk : new Desk({ ...options })
    desk.init(request)
    return desk
  }

  constructor(options?: DeskOptions) {
    this.requestLimits = options?.requestLimits || DEFAULT_REQUEST_LIMITS
  }

  init(request: ActionRequest): void {
    this.session = request.session as HubtypeSession
  }

  async getQueueById(
    queueId: string,
    deskProjectId?: string
  ): Promise<BotonicQueue> {
    try {
      const deskQueue = (await this.getDeskQueueList()).filter(queue =>
        deskProjectId
          ? queue.contains({ id: queueId, projectId: deskProjectId })
          : queue.contains({ id: queueId })
      )[0]
      if (!deskQueue) {
        throw new Error('Queue not found in desk')
      }
      return deskQueue
    } catch (e) {
      console.error(`Error in getQueueById with id ${queueId}`, e)
      return BotonicQueue.closedEmptyQueue({ id: queueId })
    }
  }

  async getQueueByName(
    queueName: string,
    deskProjectId?: string
  ): Promise<BotonicQueue> {
    try {
      const deskQueues = (await this.getDeskQueueList()).filter(deskQueue =>
        deskProjectId
          ? deskQueue.contains({ name: queueName, projectId: deskProjectId })
          : deskQueue.contains({ name: queueName })
      )
      if (deskQueues.length === 0) {
        throw new Error('Queue not found in Desk')
      }
      if (deskQueues.length > 1) {
        console.error(
          `Multiple Desk Queues with name '${queueName}'. First one used. Specify the project ID if they are in separate projects`
        )
      }
      return deskQueues[0]
    } catch (e) {
      console.error(`Error in getQueueByName with name '${queueName}'`, e)
      return BotonicQueue.closedEmptyQueue({ name: queueName })
    }
  }

  async getAvailableAgentsByQueue(queueId: string): Promise<AvailableAgent[]> {
    try {
      const baseUrl = this.session._hubtype_api || BASE_URL
      const endpointUrl = `${baseUrl}/external/v1/queues/${queueId}/available_agents/`
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${this.session._access_token}`,
        },
        method: 'get',
        url: endpointUrl,
      })
      return resp.data as AvailableAgent[]
    } catch (e) {
      console.error('Error getting avaiable agents from backend', e)
      return []
    }
  }

  async getAssignedAgentEmailByQueue(
    queue: BotonicQueue
  ): Promise<string | undefined> {
    try {
      const availableAgents = await this.getAvailableAgentsByQueue(queue.id)
      return availableAgents[0]?.email
    } catch (e) {
      console.error(`Error in getAssignedAgentEmailByQueue`, e)
    }

    return undefined
  }

  async getAssignedAgentByQueue(
    queue: BotonicQueue
  ): Promise<AvailableAgent | undefined> {
    try {
      const availableAgents = await this.getAvailableAgentsByQueue(queue.id)
      return availableAgents[0]
    } catch (e) {
      console.error(`Error in getAssignedAgentByQueue`, e)
    }

    return undefined
  }

  async isAgentAvailableInQueue(
    agentEmail: string,
    queueId: string
  ): Promise<boolean> {
    const availableAgents = await this.getAvailableAgentsByQueue(queueId)
    return availableAgents.some(
      availableAgent => availableAgent.email === agentEmail
    )
  }

  private async getDeskQueueList(page = 1): Promise<BotonicQueue[]> {
    try {
      let queues: BotonicQueue[] = []
      const baseUrl = this.session._hubtype_api || BASE_URL
      const pageSize = this.requestLimits.queues
      const endpointUrl = `${baseUrl}/external/v1/queues?page=${page}&fields=id,name,status,project_id&page_size=${pageSize}`
      console.log('queueList', {
        headers: {
          Authorization: `Bearer ${this.session._access_token}`,
        },
        method: 'get',
        url: endpointUrl,
        data: { bot_id: this.session.bot.id },
      })
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${this.session._access_token}`,
        },
        method: 'get',
        url: endpointUrl,
        data: { bot_id: this.session.bot.id },
      })
      if (resp.data.next) {
        const nextPage = page + 1
        queues = queues.concat(await this.getDeskQueueList(nextPage))
      }

      queues = queues.concat(
        resp.data.results.map(
          (deskQueue: ApiDeskQueue) => new BotonicQueue(deskQueue)
        ) as ConcatArray<BotonicQueue>
      )
      return queues
    } catch (e) {
      throw new Error(`Error getting queues from backend: ${e as string}`)
    }
  }

  async getDeskCaseList(params: GetDeskCaseListParams): Promise<DeskCase[]> {
    try {
      const baseUrl = this.session._hubtype_api || BASE_URL
      const endpointUrl = `${baseUrl}/external/v1/cases/search`
      const queryParams = this.getCaseSearchQueryParams(params)
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${this.session._access_token}`,
        },
        method: 'post',
        url: endpointUrl,
        params: queryParams,
      })
      return resp.data.results
    } catch (e) {
      console.error('Error getting cases from backend', e)
      return []
    }
  }

  private getCaseSearchQueryParams({
    searchBy,
    startDate,
    endDate,
    status = [],
    provider = [],
    queueId = [],
    projectId = [],
    agentId = [],
    cursor,
    pageSize,
  }: GetDeskCaseListParams): URLSearchParams {
    const urlParams = new URLSearchParams()

    if (searchBy) {
      urlParams.append('q', searchBy)
    }
    if (startDate) {
      const startDateParam = startDate.toISOString().replace('Z', '+00:00')
      urlParams.append('start_date', startDateParam)
    }
    if (endDate) {
      const endDateParam = endDate.toISOString().replace('Z', '+00:00')
      urlParams.append('end_date', endDateParam)
    }

    status.forEach(status => urlParams.append('status', status))
    provider.forEach(provider => urlParams.append('provider', provider))
    queueId.forEach(queueId => urlParams.append('queue_id', queueId))
    projectId.forEach(projectId => urlParams.append('project_id', projectId))
    agentId.forEach(agentId => urlParams.append('agent_id', agentId))

    if (cursor) {
      urlParams.append('cursor', cursor)
    }
    if (pageSize) {
      urlParams.append('page_size', String(pageSize))
    }

    return urlParams
  }
}
