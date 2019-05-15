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
//TODO test in backend
export async function humanHandOff(session, queue_name, on_finish) {
  let params = `create_case:${queue_name}`
  if (on_finish) {
    if (on_finish.path) params += `:__PATH_PAYLOAD__${on_finish.path}`
    else if (on_finish.payload) params += `:${on_finish.payload}`
  }
  session._botonic_action = params
}

export async function storeCaseRating(session, rating) {
  let base_url = session._hubtype_api || 'https://api.hubtype.com'
  const queues_url = `${base_url}/v1/cases/store_case_rating/`
  let chat_id = session.user.id
  let resp = await axios({
    headers: {
      Authorization: `Bearer ${session._access_token}`
    },
    method: 'post',
    url: queues_url,
    data: { chat_id, rating }
  })
  return resp.data
}
