import { PATH_PAYLOAD_IDENTIFIER } from './constants'
import { BotonicAction, EVENT_FORMAT_VERSION, type Session } from './models'

export type HandoffExtraData = {
  language?: string
  url?: string
  location?: string
}

export interface BotEventData {
  flowId: string
  flowName: string
  flowNodeId: string
  flowNodeContentId: string
}

export interface FormattedBotEventData {
  format_version: number
  flow_id: string
  flow_name: string
  flow_node_id: string
  flow_node_content_id: string
}

export enum HelpdeskEvent {
  StatusChanged = 'status_changed',
  AgentMessageCreated = 'agent_message_created',
  QueuePositionChanged = 'queue_position_changed',
}

export class HandOffBuilder {
  _session: Session
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
  _bot_event: FormattedBotEventData
  _subscribeHelpdeskEvents: HelpdeskEvent[]

  constructor(session: Session) {
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

  withBotEvent(botEvent: BotEventData): this {
    this._bot_event = {
      format_version: EVENT_FORMAT_VERSION,
      flow_id: botEvent.flowId,
      flow_name: botEvent.flowName,
      flow_node_id: botEvent.flowNodeId,
      flow_node_content_id: botEvent.flowNodeContentId,
    }
    return this
  }

  withSubscribeHelpdeskEvents(events: HelpdeskEvent[]): this {
    this._subscribeHelpdeskEvents = events
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
      this._extraData,
      this._bot_event,
      this._subscribeHelpdeskEvents
    )
  }
}

/**
 * @deprecated use {@link HandOffBuilder} class instead
 */

export async function humanHandOff(
  session: Session,
  queueNameOrId?: string,
  onFinish?: {
    path?: string
    payload?: string
  }
): Promise<void> {
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

export interface HubtypeHandoffParams {
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
  bot_event?: FormattedBotEventData
  subscribe_helpdesk_events?: HelpdeskEvent[]
}
async function _humanHandOff(
  session: Session,
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
  extraData: HandoffExtraData | undefined = undefined,
  botEvent: FormattedBotEventData,
  subscribeHelpdeskEvents: HelpdeskEvent[] = []
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
  if (botEvent) {
    params.bot_event = botEvent
  }
  if (subscribeHelpdeskEvents.length > 0) {
    params.subscribe_helpdesk_events = subscribeHelpdeskEvents
  }
  session._botonic_action = `${BotonicAction.CreateCase}:${JSON.stringify(params)}`
}
