import axios from 'axios'

export async function conditionalQueueStatus({ queueId }): Promise<string> {
  const response = await axios.get(
    `https://api.hubtype.com/v1/queues/${queueId}/availability/`
  )
  const isAvailable = response.data.available
  return isAvailable ? 'open' : 'closed'
}
