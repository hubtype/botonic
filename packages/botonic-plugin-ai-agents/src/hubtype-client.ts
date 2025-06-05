import { BotContext } from '@botonic/core'
import axios from 'axios'

import { HUBTYPE_API_URL } from './constants'
import { AgenticMessage } from './types'

export class HubtypeClient {
  private readonly authToken: string

  constructor(authToken: string) {
    this.authToken = authToken
  }

  async getMessages(
    request: BotContext,
    memoryLength: number
  ): Promise<AgenticMessage[]> {
    const url = `${HUBTYPE_API_URL}/external/v1/ai/agent/message_history/`
    const data = {
      last_message_id: request.input.message_id,
      num_messages: memoryLength,
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authToken}`,
      },
    }

    try {
      const messages = await axios.post<{ messages: AgenticMessage[] }>(
        url,
        data,
        config
      )

      return messages.data.messages
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get messages from Hubtype')
    }
  }
}
