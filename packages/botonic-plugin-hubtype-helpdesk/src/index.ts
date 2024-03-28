import { BotRequest, Plugin, PluginPreRequest } from '@botonic/core'

import { ApiDeskQueue } from '../desk'
import Api from './api'
import { Queue } from './index'

export enum deskQueueStatus {
  OPEN = 'status_open',
  CLOSED = 'status_closed',
}

const emptyQueue = {
  ID: '',
  NAME: '',
}

export class DeskQueue implements Queue {
  readonly id: string
  readonly name: string
  readonly status: string
  readonly projectId: string
  readonly isOpen: boolean

  constructor(queue: ApiDeskQueue) {
    this.id = queue.id
    this.name = queue.name
    this.status = queue.status
    this.projectId = queue.project_id
    this.isOpen = this.status === deskQueueStatus.OPEN
  }

  contains(queue: Partial<DeskQueue>): boolean {
    for (const key in queue) {
      if (this[key as keyof DeskQueue] !== queue[key as keyof DeskQueue]) {
        return false
      }
    }
    return true
  }

  static closedEmptyQueue(params?: { id?: string; name?: string }) {
    return new DeskQueue({
      id: params?.id || emptyQueue.ID,
      name: params?.name || emptyQueue.NAME,
      status: deskQueueStatus.CLOSED,
      project_id: '',
    })
  }
}

export default class BotonicPluginHubtypeHelpdesk implements Plugin {
  private api: Api
  private readonly API_BASE_URL =
    process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'
  constructor(options) {
    this.api = new Api()
  }

  async getDeskQueueList(request: BotRequest, page = 1): Promise<DeskQueue[]> {
    try {
      let queues: DeskQueue[] = []
      //const pageSize = this.requestLimits.queues
      const pageSize = 10
      const endpointUrl = `${this.API_BASE_URL}/external/v1/queues?page=${page}&fields=id,name,status,project_id&page_size=${pageSize}`
      console.log('queueList', {
        headers: {
          Authorization: `Bearer ${request.session._access_token}`,
        },
        method: 'get',
        url: endpointUrl,
        data: { bot_id: request.session.bot.id },
      })
      const resp = await this.api.get(endpointUrl, {
        bot_id: request.session.bot.id,
      })
      // const resp = await axios({
      //   headers: {
      //     Authorization: `Bearer ${request.session._access_token}`,
      //   },
      //   method: 'get',
      //   url: endpointUrl,
      //   data: { bot_id: request.session.bot.id },
      // })
      if (resp.data.next) {
        const nextPage = page + 1
        queues = queues.concat(await this.getDeskQueueList(request, nextPage))
      }

      queues = queues.concat(
        resp.data.results.map(
          (deskQueue: ApiDeskQueue) => new DeskQueue(deskQueue)
        ) as ConcatArray<DeskQueue>
      )
      return queues
    } catch (e) {
      throw new Error(`Error getting queues from backend: ${e as string}`)
    }
  }

  pre(request: PluginPreRequest): void {
    return
  }
}
