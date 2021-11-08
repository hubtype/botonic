import axios from 'axios'

export async function localSender({ event, websocketId }) {
  await axios.post(`${WEBSOCKET_URL}send/`, {
    event,
    websocketId,
  })
}
