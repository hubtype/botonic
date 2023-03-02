import axios from 'axios'

export async function conditionalQueueStatus({ queue_id }): Promise<string> {
  const response = await axios.get(
    `https://api.hubtype.com/v1/queues/${queue_id}/availability/`,
    // TODO: Make it configurable in the future
    {
      params: {
        check_queue_schedule: true,
        check_waiting_cases: false,
        check_available_agents: false,
      },
    }
  )
  const isAvailable = response.data.available
  return isAvailable ? 'open' : 'closed'
}
