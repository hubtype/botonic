export interface Queue {
  id: string
  name: string
  isOpen: boolean
}

export enum deskQueueStatus {
  OPEN = 'status_open',
  CLOSED = 'status_closed',
}
export interface ApiDeskQueue {
  id: string
  name: string
  status: string
  project_id: string
}

const emptyQueue = {
  ID: '',
  NAME: '',
}

export class BotonicQueue implements Queue {
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

  contains(queue: Partial<BotonicQueue>): boolean {
    for (const key in queue) {
      if (
        this[key as keyof BotonicQueue] !== queue[key as keyof BotonicQueue]
      ) {
        return false
      }
    }
    return true
  }

  static closedEmptyQueue(params?: { id?: string; name?: string }) {
    return new BotonicQueue({
      id: params?.id || emptyQueue.ID,
      name: params?.name || emptyQueue.NAME,
      status: deskQueueStatus.CLOSED,
      project_id: '',
    })
  }
}
