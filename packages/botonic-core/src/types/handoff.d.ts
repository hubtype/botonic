import { Session } from '.'

export interface HubtypeAgentsInfo {
  attending_count: number
  email: string
  idle_count: number
  last_message_sent: string
  status: string
}

export declare function getOpenQueues(
  session: Session
): Promise<{ queues: string[] }>

export declare function storeCaseRating(
  session: Session,
  rating: number
): Promise<{ status: string }>

export declare function getAvailableAgentsByQueue(
  session: Session,
  queueId: string
): Promise<{ agents: string[] }>

export declare function getAvailableAgents(
  session: Session
): Promise<{ agents: HubtypeAgentsInfo[] }>

interface VacationRange {
  end_date: number // timestamp
  id: number
  start_date: number // timestamp
}

export declare function getAgentVacationRanges(
  session: Session,
  agentParams: { agentId?: string; agentEmail?: string }
): Promise<{ vacation_ranges: VacationRange[] }>

export declare function cancelHandoff(
  session: Session,
  typification?: string
): void

export declare function deleteUser(session: Session): void

export declare class HandOffBuilder {
  constructor(session: Session)
  _agentId: string
  _caseInfo: string
  _email: string
  _note: string
  _onFinish: string
  _queue: string
  _session: Session
  _shadowing: boolean
  handOff(): Promise<void>
  withAgentEmail(email: string): HandOffBuilder
  withAgentId(agentId: string): HandOffBuilder
  withCaseInfo(caseInfo: string): HandOffBuilder
  withNote(note: string): HandOffBuilder
  withOnFinishPath(path: string): HandOffBuilder
  withOnFinishPayload(payload: string): HandOffBuilder
  withQueue(queueNameOrId: string): HandOffBuilder
  withShadowing(shadowing?: boolean): HandOffBuilder
}

/**
 * @deprecated use {@link HandOffBuilder} class instead
 */
export declare function humanHandOff(
  session: Session,
  queueNameOrId: string, // queue_name for backward compatibility, queue_id for new versions
  onFinish: { payload?: string; path?: string }
): Promise<void>
