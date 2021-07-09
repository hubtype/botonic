import { Session } from '../types/'
export interface User {
  id: string //TODO: UUID
  websocketId: string
  session: Session
  route: string
  isOnline: boolean
  locationInfo: string
}
