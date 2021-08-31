import { Session } from '../index'
export interface User {
  id: string //TODO: UUID
  providerId?: string
  websocketId?: string
  session: Session
  route: string
  isOnline: boolean
  locationInfo: string
}
