import { BotonicEvent } from '@botonic/core/src/models/events'
import { User } from '@botonic/core/src/models/user'

import { DataProvider } from '.'

export class LocalDevDataProvider implements DataProvider {
  users: any
  events: BotonicEvent[]
  connections: {}

  constructor() {
    this.users = []
    this.events = []
    this.connections = []
  }

  getUser(userId: string): User | undefined {
    const filteredUser = this.users.filter(u => u.id === userId)
    if (filteredUser.length === 0) return undefined
    return filteredUser[0]
  }

  saveUser(user: User): User {
    this.users.push(user)
    return user
  }

  updateUser(user: User): User {
    this.users = this.users.map(u => (u.id === user.id ? user : u))
    return user
  }

  getEvent(id: string) {
    return this.events.find(e => e.userId === id)
  }

  saveEvent(event: BotonicEvent): BotonicEvent {
    this.events.push(event)
    return event
  }

  addConnection(websocketId: string) {
    this.connections[`${websocketId}`] = ''
  }
  updateConnection(websocketId: string, userId: string) {
    this.connections[`${websocketId}`] = userId
  }
  deleteConnection(websocketId: string) {
    delete this.connections[`${websocketId}`]
  }

  getUserByWebsocketId(websocketId: string) {
    return this.users.find(u => u.websocketId === websocketId)
  }
}
