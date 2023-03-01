import axios from 'axios'

import { PATH_PAYLOAD_IDENTIFIER } from './constants'
import { Session } from './models'

const HUBTYPE_API_URL = 'https://api.hubtype.com'

export interface HubtypeAgentsInfo {
  attending_count: number
  email: string
  idle_count: number
  last_message_sent: string
  status: string
}
export interface HubtypeSession extends Session {
  _hubtype_api?: string
  _access_token: string
}

export interface SessionWithBotonicAction extends Session {
  _botonic_action: string
}
export interface BackendContext {
  timeoutMs: number
}

export interface VacationRange {
  end_date: number // timestamp
  id: number
  start_date: number // timestamp
}

export type HandoffExtraData = {
  language?: string
  url?: string
  location?: string
}

function contextDefaults(context: any): BackendContext {
  return {
    timeoutMs: context.timeoutMs || 10000,
  }
}

export async function getOpenQueues(
  session: HubtypeSession,
  context = {}
): Promise<{ queues: string[] }> {
  //be aware of https://github.com/axios/axios/issues/1543
  const baseUrl = session._hubtype_api || HUBTYPE_API_URL
  const endpointUrl = `${baseUrl}/v1/queues/get_open_queues/`
  context = contextDefaults(context)
  const resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`,
    },
    method: 'post',
    url: endpointUrl,
    data: { bot_id: session.bot.id },
    timeout: (context as BackendContext).timeoutMs,
  })
  return resp.data
}

export class HandOffBuilder {
  _session: SessionWithBotonicAction
  _queue: string
  _onFinish: string
  _email: string
  _agentId: string
  _forceAssignIfNotAvailable: boolean
  _autoAssignOnWaiting: boolean
  _note: string
  _caseInfo: string
  _autoIdleMessage: string
  _shadowing: boolean
  _extraData: HandoffExtraData

  constructor(session: SessionWithBotonicAction) {
    this._session = session
  }

  withQueue(queueNameOrId: string): this {
    this._queue = queueNameOrId
    return this
  }

  withOnFinishPayload(payload: string): this {
    this._onFinish = payload
    return this
  }

  withOnFinishPath(path: string): this {
    this._onFinish = `${PATH_PAYLOAD_IDENTIFIER}${path}`
    return this
  }

  withAgentEmail(email: string): this {
    this._email = email
    return this
  }

  withAgentId(agentId: string): this {
    this._agentId = agentId
    return this
  }

  withForceAssignIfNotAvailable(forceAssign: boolean): this {
    this._forceAssignIfNotAvailable = forceAssign
    return this
  }

  withAutoAssignOnWaiting(autoAssignOnWaiting: boolean): this {
    this._autoAssignOnWaiting = autoAssignOnWaiting
    return this
  }

  withNote(note: string): this {
    this._note = note
    return this
  }

  withCaseInfo(caseInfo: string): this {
    this._caseInfo = caseInfo
    return this
  }

  withAutoIdleMessage(message: string): this {
    this._autoIdleMessage = message
    return this
  }

  withShadowing(shadowing = true): this {
    this._shadowing = shadowing
    return this
  }

  withExtraData(extraData: HandoffExtraData): this {
    this._extraData = extraData
    return this
  }

  async handOff(): Promise<void> {
    return _humanHandOff(
      this._session,
      this._queue,
      this._onFinish,
      this._email,
      this._agentId,
      this._forceAssignIfNotAvailable,
      this._autoAssignOnWaiting,
      this._caseInfo,
      this._note,
      this._autoIdleMessage,
      this._shadowing,
      this._extraData
    )
  }
}

/**
 * @deprecated use {@link HandOffBuilder} class instead
 */
export async function humanHandOff(session, queueNameOrId = '', onFinish) {
  const builder = new HandOffBuilder(session)
  if (queueNameOrId) {
    builder.withQueue(queueNameOrId)
  }
  if (onFinish) {
    if (onFinish.path) {
      builder.withOnFinishPath(onFinish.path)
    } else if (onFinish.payload) {
      builder.withOnFinishPayload(onFinish.payload)
    } else {
      throw new Error('onFinish requires payload or path field')
    }
  }
  return builder.handOff()
}

interface HubtypeHandoffParams {
  queue?: string
  agent_email?: string
  agent_id?: string
  force_assign_if_not_available?: boolean
  auto_assign_on_waiting?: boolean
  case_info?: string
  note?: string
  auto_idle_message?: string
  shadowing?: boolean
  on_finish?: string
  case_extra_data?: HandoffExtraData
}
async function _humanHandOff(
  session: SessionWithBotonicAction,
  queueNameOrId = '',
  onFinish: string,
  agentEmail = '',
  agentId = '',
  forceAssignIfNotAvailable = true,
  autoAssignOnWaiting = false,
  caseInfo = '',
  note = '',
  autoIdleMessage = '',
  shadowing = false,
  extraData: HandoffExtraData | undefined = undefined
) {
  const params: HubtypeHandoffParams = {}

  params.force_assign_if_not_available = forceAssignIfNotAvailable

  if (queueNameOrId) {
    params.queue = queueNameOrId
  }
  if (agentEmail) {
    params.agent_email = agentEmail
  }
  if (agentId) {
    params.agent_id = agentId
  }
  if (autoAssignOnWaiting) {
    params.auto_assign_on_waiting = autoAssignOnWaiting
  }
  if (caseInfo) {
    params.case_info = caseInfo
  }
  if (note) {
    params.note = note
  }
  if (autoIdleMessage) {
    params.auto_idle_message = autoIdleMessage
  }
  if (shadowing) {
    params.shadowing = shadowing
  }
  if (onFinish) {
    params.on_finish = onFinish
  }
  if (extraData) {
    params.case_extra_data = extraData
  }
  session._botonic_action = `create_case:${JSON.stringify(params)}`
}

export async function storeCaseRating(
  session: HubtypeSession,
  rating: number,
  context: any = {}
): Promise<{ status: string }> {
  const baseUrl = session._hubtype_api || HUBTYPE_API_URL
  const chatId = session.user.id
  context = contextDefaults(context)
  const resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`,
    },
    method: 'post',
    url: `${baseUrl}/v1/chats/${chatId}/store_case_rating/`,
    data: { chat_id: chatId, rating },
    timeout: (context as BackendContext).timeoutMs,
  })
  return resp.data
}

export async function getAvailableAgentsByQueue(
  session: HubtypeSession,
  queueId: string
): Promise<{ agents: string[] }> {
  const baseUrl = session._hubtype_api || HUBTYPE_API_URL
  const resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`,
    },
    method: 'post',
    url: `${baseUrl}/v1/queues/${queueId}/get_available_agents/`,
  })
  return resp.data
}

export async function getAvailableAgents(
  session: HubtypeSession
): Promise<{ agents: HubtypeAgentsInfo[] }> {
  const baseUrl = session._hubtype_api || HUBTYPE_API_URL
  const botId = session.bot.id
  const resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`,
    },
    method: 'post',
    url: `${baseUrl}/v1/bots/${botId}/get_agents/`,
  })
  return resp.data
}

export async function getAgentVacationRanges(
  session: HubtypeSession,
  { agentId, agentEmail }: { agentId?: string; agentEmail?: string }
): Promise<{ vacation_ranges: VacationRange[] }> {
  const baseUrl = session._hubtype_api || HUBTYPE_API_URL
  const botId = session.bot.id
  const resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`,
    },
    method: 'get',
    url: `${baseUrl}/v1/bots/${botId}/get_agent_vacation_ranges/`,
    params: { agent_id: agentId, agent_email: agentEmail },
  })
  return resp.data
}

export function cancelHandoff(
  session: SessionWithBotonicAction,
  typification: string | null = null
): void {
  let action = 'discard_case'
  if (typification) action = `${action}:${JSON.stringify({ typification })}`
  session._botonic_action = action
}

export function deleteUser(session: SessionWithBotonicAction): void {
  session._botonic_action = `delete_user`
}
