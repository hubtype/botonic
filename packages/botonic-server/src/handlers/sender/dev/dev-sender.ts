import axios from 'axios'

export async function devSender({ user: { websocketId }, event }) {
  await axios.post(`${WEBSOCKET_URL}send/`, { event, websocketId })
}
