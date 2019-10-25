import axios from 'axios'

export async function getOpenQueues(session) {
  let baseUrl = session._hubtype_api || 'https://api.hubtype.com'
  const endpointUrl = `${baseUrl}/v1/queues/get_open_queues/`
  let resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`
    },
    method: 'post',
    url: endpointUrl,
    data: { bot_id: session.bot.id }
  })
  return resp.data
}

export async function humanHandOff(
  session,
  queueNameOrId = '',
  onFinish,
  agentEmail = '',
  extraInfo
) {
  let params = `create_case:${queueNameOrId}:${agentEmail}`
  if (!queueNameOrId && agentEmail) {
    throw 'You must provide a queue ID'
  }
  if (extraInfo) {
    params += extraInfo.caseInfo
      ? `:${encodeURIComponent(extraInfo.caseInfo)}`
      : ':'
    params += extraInfo.note ? `:${encodeURIComponent(extraInfo.note)}` : ':'
  }
  if (onFinish) {
    if (onFinish.path) params += `:__PATH_PAYLOAD__${onFinish.path}`
    else if (onFinish.payload) params += `:${onFinish.payload}`
  }
  session._botonic_action = params
}

export async function storeCaseRating(session, rating) {
  let baseUrl = session._hubtype_api || 'https://api.hubtype.com'
  let chatId = session.user.id
  let resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`
    },
    method: 'post',
    url: `${baseUrl}/v1/chats/${chatId}/store_case_rating/`,
    data: { chat_id: chatId, rating }
  })
  return resp.data
}

export async function getAvailableAgents(session, queueId) {
  let baseUrl = session._hubtype_api || 'https://api.hubtype.com'
  let resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`
    },
    method: 'post',
    url: `${baseUrl}/v1/queues/${queueId}/get_available_agents/`,
    data: { bot_id: session.bot.id, queue_id: queueId }
  })
  return resp.data
}
