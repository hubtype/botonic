import axios from 'axios'

export async function getOpenQueues(session) {
  let base_url = session._hubtype_api || 'https://api.hubtype.com'
  const queues_url = `${base_url}/v1/queues/get_open_queues/`
  let bot_id = session.bot.id
  let resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`
    },
    method: 'post',
    url: queues_url,
    data: { bot_id }
  })
  return resp.data
}

export async function humanHandOff({
  session,
  queueName = '',
  onFinish,
  agentEmail = '',
  extraInfo
}) {
  let params = `create_case:${queueName}:${agentEmail}`
  if (!queueName && agentEmail) {
    throw 'You must provide a queueName'
  }
  if (extraInfo) {
    if (extraInfo.caseInfo)
      params += `:__CASE_INFO__${extraInfo.caseInfo}__END_CASE_INFO__`
    if (extraInfo.note) params += `:__NOTE__${extraInfo.note}__END_NOTE__`
  }
  if (onFinish) {
    if (onFinish.path) params += `:__PATH_PAYLOAD__${onFinish.path}`
    else if (onFinish.payload) params += `:${onFinish.payload}`
  }
  session._botonic_action = params
}

export async function storeCaseRating(session, rating) {
  let base_url = session._hubtype_api || 'https://api.hubtype.com'
  let chat_id = session.user.id

  let resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`
    },
    method: 'post',
    url: `${base_url}/v1/chats/${chat_id}/store_case_rating/`,
    data: { chat_id, rating }
  })
  return resp.data
}
