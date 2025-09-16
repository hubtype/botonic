/* eslint-disable @typescript-eslint/naming-convention */
import { BotContext } from '@botonic/core'
import axios from 'axios'

import { HUBTYPE_API_URL } from './constants'
import { AgenticInputMessage } from './types'

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

  async retrieveSimilarChunks(
    query: string,
    sources: string[]
  ): Promise<string[]> {
    const url = `${HUBTYPE_API_URL}/external/v1/ai/knowledge_base/similar_chunks/`
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    }
    const params = {
      query,
      source_ids: sources,
      num_chunks: 5,
    }
    const response = await axios.post(url, params, { headers })
    return response.data.chunks.map((chunk: any) => chunk.text)
  }

  async getLocalMessages(
    maxMemoryLength: number
  ): Promise<AgenticInputMessage[]> {
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
    return filteredMessages.slice(-maxMemoryLength)
  }

  async getMessages(
    request: BotContext,
    maxMemoryLength: number
  ): Promise<AgenticInputMessage[]> {
    const url = `${HUBTYPE_API_URL}/external/v1/ai/agent/message_history/`
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    }
    const params = {
      last_message_id: request.input.message_id,
      num_messages: maxMemoryLength,
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
