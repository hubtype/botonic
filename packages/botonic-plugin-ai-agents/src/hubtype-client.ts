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
    _request: BotContext,
    _memoryLength: number
  ): Promise<AgenticMessage[]> {
    const url = `${HUBTYPE_API_URL}/external/v1/ai/agent/message_history/`
    const data = {
      memory_length: _memoryLength,
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authToken}`,
      },
    }

    console.log('getMessages', url, data, config)
    try {
      const messages = await axios.post<AgenticMessage[]>(url, data, config)
      console.log('getMessages response', messages.data)
      return messages.data
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get messages from Hubtype')
    }
  }
}
