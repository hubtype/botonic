import axios from 'axios'

export async function conditionalQueueStatus({ queue_id }): Promise<string> {
  const response = await axios.get(
    `https://api.hubtype.com/v1/queues/${queue_id}/availability/`
  )
  const isAvailable = response.data.available
  return isAvailable ? 'open' : 'closed'
}
