import { BotContext } from '@botonic/core'
import axios from 'axios'

import { HUBTYPE_API_URL } from './constants'
import { AgenticInputMessage } from './types'

export class HubtypeClient {
  private readonly authToken: string

  constructor(authToken: string) {
    this.authToken = authToken
  }

  async getMessages(
    request: BotContext,
    memoryLength: number
  ): Promise<AgenticInputMessage[]> {
    const url = `${HUBTYPE_API_URL}/external/v1/ai/agent/message_history/`
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    }
    const params = {
      last_message_id: request.input.message_id,
      num_messages: memoryLength,
    }

    try {
      const messages = await axios.get<{ messages: AgenticInputMessage[] }>(
        url,
        {
          headers,
          params,
        }
      )

      return messages.data.messages
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get messages from Hubtype')
    }
  }
}
