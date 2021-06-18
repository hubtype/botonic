import axios from 'axios'

const HUBTYPE_API_URL = 'https://api.hubtype.com'

function contextDefaults(context) {
  return {
    timeoutMs: context.timeoutMs || 10000,
  }
}

export async function getOpenQueues(session, context = {}) {
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
    timeout: context.timeoutMs,
  })
  return resp.data
}

export class HandOffBuilder {
  constructor(session) {
    this._session = session
  }

  withQueue(queueNameOrId) {
    this._queue = queueNameOrId
    return this
  }

  withOnFinishPayload(payload) {
    this._onFinish = payload
    return this
  }

  withOnFinishPath(path) {
    this._onFinish = `__PATH_PAYLOAD__${path}`
    return this
  }

  withAgentEmail(email) {
    this._email = email
    return this
  }

  withAgentId(agentId) {
    this._agentId = agentId
    return this
  }

  withNote(note) {
    this._note = note
    return this
  }

  withCaseInfo(caseInfo) {
    this._caseInfo = caseInfo
    return this
  }

  withShadowing(shadowing = true) {
    this._shadowing = shadowing
    return this
  }

  async handOff() {
    return _humanHandOff(
      this._session,
      this._queue,
      this._onFinish,
      this._email,
      this._agentId,
      this._caseInfo,
      this._note,
      this._shadowing
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

async function _humanHandOff(
  session,
  queueNameOrId = '',
  onFinish,
  agentEmail = '',
  agentId = '',
  caseInfo = '',
  note = '',
  shadowing = false
) {
  const params = {}
  if (queueNameOrId) {
    params.queue = queueNameOrId
  }
  if (agentEmail) {
    params.agent_email = agentEmail
  }
  if (agentId) {
    params.agent_id = agentId
  }
  if (caseInfo) {
    params.case_info = caseInfo
  }
  if (note) {
    params.note = note
  }
  if (shadowing) {
    params.shadowing = shadowing
  }
  if (onFinish) {
    params.on_finish = onFinish
  }
  session._botonic_action = `create_case:${JSON.stringify(params)}`
}

export async function storeCaseRating(session, rating, context = {}) {
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
    timeout: context.timeoutMs,
  })
  return resp.data
}

export async function getAvailableAgentsByQueue(session, queueId) {
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

export async function getAvailableAgents(session) {
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

export async function getAgentVacationRanges(session, { agentId, agentEmail }) {
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

export function cancelHandoff(session, typification = null) {
  let action = 'discard_case'
  if (typification) action = `${action}:${JSON.stringify({ typification })}`
  session._botonic_action = action
}

export function deleteUser(session) {
  session._botonic_action = `delete_user`
}
