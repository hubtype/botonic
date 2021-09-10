import { BotonicEvent, User } from '../models'

export interface DataProvider {
  getUsers(limit?: number, offset?: number): User[] | Promise<User[]>
  getUser(id: string): User | Promise<User | undefined> | undefined
  //TODO: replace getUserByWebsocketId to getUserByField?
  getUserByWebsocketId(
    websocketId: string
  ): User | Promise<User | undefined> | undefined
  getUserByField(
    field: string,
    value: any
  ): User | Promise<User | undefined> | undefined
  saveUser(user: User): User | Promise<User>
  updateUser(user: User): User | Promise<User>
  deleteUser(id: string): User | Promise<User | undefined> | undefined
  getEvents(
    limit?: number,
    offset?: number
  ): BotonicEvent[] | Promise<BotonicEvent[]>
  getEvent(
    id: string
  ): BotonicEvent | Promise<BotonicEvent | undefined> | undefined
  saveEvent(event: BotonicEvent): BotonicEvent | Promise<BotonicEvent>
  updateEvent(event: BotonicEvent): BotonicEvent | Promise<BotonicEvent>
  deleteEvent(
    id: string
  ): BotonicEvent | Promise<BotonicEvent | undefined> | undefined
}
