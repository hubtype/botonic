/* eslint-disable @typescript-eslint/naming-convention */
import { BotContext } from '@botonic/core'
import axios from 'axios'

import { HUBTYPE_API_URL } from './constants'
import { AgenticInputMessage } from './types'
import { UserMessageItem } from '@openai/agents'

interface HubtypeAssistantMessage {
  role: 'assistant'
  content: string
}

interface HubtypeUserMessage {
  role: 'user'
  content: string
}

type HubtypeMessage = HubtypeAssistantMessage | HubtypeUserMessage

export class HubtypeApiClient {
  private readonly authToken: string

  constructor(authToken: string) {
    this.authToken = authToken
  }

  async getLocalMessages(memoryLength: number): Promise<AgenticInputMessage[]> {
    const localBotonicState = localStorage.getItem('botonicState')
    const botonicState = JSON.parse(localBotonicState || '{}')
    const messages = botonicState.messages
    const filteredMessages = messages
      .filter(message => message.data.text)
      .map(message => ({
        role: message.sentBy === 'user' ? 'user' : 'assistant',
        content: message.data.text,
      }))
      .map(message => this.formatMessage(message))
    return filteredMessages.slice(-memoryLength)
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
      return messages.map(message => this.formatMessage(message))
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get messages from Hubtype')
    }
  }

  private formatMessage(message: HubtypeMessage): AgenticInputMessage {
    if (message.role === 'user') {
      return {
        content: message.content,
        role: 'user',
      }
    } else if (message.role === 'assistant') {
      return {
        role: 'assistant',
        content: [
          {
            type: 'output_text',
            text: message.content,
          },
        ],
        status: 'completed',
      }
    } else {
      throw new Error('Invalid message role')
    }
  }
}
