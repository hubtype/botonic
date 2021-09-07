import axios from 'axios'

export async function localSender({ messages, websocketId }) {
  for (const message of messages) {
    await axios.post(`${WEBSOCKET_URL}send/`, {
      message,
      websocketId,
    })
  }
}
