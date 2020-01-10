import axios from 'axios'

export async function getOpenQueues(session) {
  let baseUrl = session._hubtype_api || 'https://api.hubtype.com'
  const endpointUrl = `${baseUrl}/v1/queues/get_open_queues/`
  let resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`,
    },
    method: 'post',
    url: endpointUrl,
    data: { bot_id: session.bot.id },
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

  withNote(note) {
    this._note = note
    return this
  }

  withCaseInfo(caseInfo) {
    this._caseInfo = caseInfo
    return this
  }

  async handOff() {
    return _humanHandOff(
      this._session,
      this._queue,
      this._onFinish,
      this._email,
      this._caseInfo,
      this._note
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
    if (onFinish['path']) {
      builder.withOnFinishPath(onFinish['path'])
    } else if (onFinish['payload']) {
      builder.withOnFinishPayload(onFinish['payload'])
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
  caseInfo = '',
  note = ''
) {
  let params = {}
  if (!queueNameOrId && agentEmail) {
    throw 'You must provide a queue ID'
  }
  if (queueNameOrId) {
    params.queue = queueNameOrId
  }
  if (agentEmail) {
    params.agent_email = agentEmail
  }
  if (caseInfo) {
    params.case_info = caseInfo
  }
  if (note) {
    params.note = note
  }

  if (onFinish) {
    params.on_finish = onFinish
  }
  session._botonic_action = `create_case:${JSON.stringify(params)}`
}

export async function storeCaseRating(session, rating) {
  let baseUrl = session._hubtype_api || 'https://api.hubtype.com'
  let chatId = session.user.id
  let resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`,
    },
    method: 'post',
    url: `${baseUrl}/v1/chats/${chatId}/store_case_rating/`,
    data: { chat_id: chatId, rating },
  })
  return resp.data
}

export async function getAvailableAgentsByQueue(session, queueId) {
  let baseUrl = session._hubtype_api || 'https://api.hubtype.com'
  let resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`,
    },
    method: 'post',
    url: `${baseUrl}/v1/queues/${queueId}/get_available_agents/`,
    data: { queue_id: queueId },
  })
  return resp.data
}

export async function getAvailableAgents(session) {
  let baseUrl = session._hubtype_api || 'https://api.hubtype.com'
  let botId = session.bot.id
  let resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`,
    },
    method: 'post',
    url: `${baseUrl}/v1/bots/${botId}/get_available_agents/`,
  })
  return resp.data
}
