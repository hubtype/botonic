import axios from 'axios'

export async function localSender({ events, websocketId }) {
  for (const event of events) {
    await axios.post(`${WEBSOCKET_URL}send/`, {
      event,
      websocketId,
    })
  }
}
