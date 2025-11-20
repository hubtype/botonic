import axios from 'axios'

const HUBTYPE_API_URL = process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

interface AvailabilityData {
  available: boolean
  waiting_cases: number
  availability_threshold_waiting_cases: number
  open: boolean
  name: string
  available_agents: number
}
export class HubtypeQueuesApi {
  public queueId: string
  public checkAvailableAgents: boolean

  constructor(queueId: string, checkAvailableAgents?: boolean) {
    this.queueId = queueId
    this.checkAvailableAgents = checkAvailableAgents || false
  }

  async getAvailability(): Promise<AvailabilityData> {
    const response = await axios.get(
      `${HUBTYPE_API_URL}/external/v1/queues/${this.queueId}/availability/`,
      // TODO: Make it configurable in the future
      {
        params: {
          check_queue_schedule: true,
          check_waiting_cases: false,
          check_available_agents: this.checkAvailableAgents,
        },
      }
    )
    return response.data
  }
}
