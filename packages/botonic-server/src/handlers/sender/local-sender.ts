import axios from 'axios'

export async function localSender({ user, event }) {
  await axios.post(`${WEBSOCKET_URL}send/`, {
    event,
    websocketId: user.websocketId,
  })
}
