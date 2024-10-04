import { HubtypeSession, Plugin, PluginPreRequest } from '@botonic/core'
import { AxiosRequestHeaders } from 'axios'

import Api, { ApiOptions } from './api'
import { ApiDeskQueue, BotonicQueue } from './queue'
import {
  AvailableAgent,
  DeskCase,
  DeskCaseSearchResponse,
  DeskInterface,
  DeskQueueResponse,
  GetDeskCaseListParams,
  PluginHubtypeHelpdeskOptions,
  RequestLimits,
} from './types'
import { resolveGetAccessToken, resolveGetBotId } from './utils'

interface HelpdeskPlugin extends DeskInterface, Plugin {}

const BASE_URL = 'https://api.hubtype.com'

const DEFAULT_REQUEST_LIMITS: RequestLimits = {
  queues: '200',
}

export default class BotonicPluginHubtypeHelpdesk implements HelpdeskPlugin {
  private api: Api
  private session!: HubtypeSession
  private getAccessToken: (session: HubtypeSession) => string
  private getBotId: (session: HubtypeSession) => string
  private readonly requestLimits: RequestLimits

  constructor(options: PluginHubtypeHelpdeskOptions) {
    this.requestLimits = options?.requestLimits || DEFAULT_REQUEST_LIMITS
    this.getBotId = resolveGetBotId(options)
    this.getAccessToken = resolveGetAccessToken(options)
    this.api = this.getApi(options.session)
  }

  pre(request: PluginPreRequest): void {
    this.session = request.session as HubtypeSession
    this.api = this.getApi(this.session)
  }

  private getApi(session?: HubtypeSession): Api {
    const apiOptions: ApiOptions = {
      headers: session
        ? ({
            Authorization: `Bearer ${this.getAccessToken(session)}`,
          } as AxiosRequestHeaders)
        : undefined,

      retries: 3,
    }

    return new Api(apiOptions)
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
      const resp = await this.api.get<AvailableAgent[]>(endpointUrl)
      return resp
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

      const resp = await this.api.get<DeskQueueResponse>(endpointUrl, {
        params: {
          bot_id: this.getBotId(this.session),
        },
        retries: 4,
        timeout: 10,
      })
      console.log('getDeskQueueList - resp', JSON.stringify(resp))
      if (resp.next) {
        const nextPage = page + 1
        queues = queues.concat(await this.getDeskQueueList(nextPage))
      }

      queues = queues.concat(
        resp.results.map(
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
      const resp = await this.api.post<DeskCaseSearchResponse>(endpointUrl, {
        data: queryParams,
      })

      return resp.results
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
