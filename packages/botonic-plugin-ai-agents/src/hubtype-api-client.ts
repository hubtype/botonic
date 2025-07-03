import { BotContext } from '@botonic/core'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import axios from 'axios'

import { HUBTYPE_API_URL } from './constants'
import { AgenticInputMessage } from './types'

type HubtypeMessage = {
  role: 'user' | 'assistant'
  content: string
}

export class HubtypeApiClient {
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
      const response = await axios.get<{ messages: HubtypeMessage[] }>(url, {
        headers,
        params,
      })

      const messages = response.data.messages
      return messages.map(message => {
        if (message.role === 'user') {
          return new HumanMessage(message.content)
        }
        return new AIMessage(message.content)
      })
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get messages from Hubtype')
    }
  }
}
