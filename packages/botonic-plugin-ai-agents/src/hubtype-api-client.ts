/* eslint-disable @typescript-eslint/naming-convention */
import type { BotContext } from '@botonic/core'
import axios from 'axios'

import { HUBTYPE_API_URL } from './constants'
import type { AgenticInputMessage, Chunk } from './types'

interface HubtypeAssistantMessage {
  role: 'assistant'
  content: string
}

interface HubtypeUserMessage {
  role: 'user'
  content: string
}

type HubtypeMessage = HubtypeAssistantMessage | HubtypeUserMessage

// V2 API Types
interface HubtypeToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

interface HubtypeUserMessageV2 {
  role: 'user'
  content: string | null
}

interface HubtypeAssistantMessageV2 {
  role: 'assistant'
  content: string | null
  tool_calls?: HubtypeToolCall[] | null
}

interface HubtypeToolMessageV2 {
  role: 'tool'
  content: string | null
  tool_call_id: string
}

interface HubtypeSystemMessageV2 {
  role: 'system'
  content: string | null
}

type HubtypeMessageV2 =
  | HubtypeUserMessageV2
  | HubtypeAssistantMessageV2
  | HubtypeToolMessageV2
  | HubtypeSystemMessageV2

interface MessageHistoryResponseV2 {
  messages: HubtypeMessageV2[]
  conversation_id: string | null
  truncated: boolean
}

export interface GetMessagesV2Options {
  maxMessages?: number
  includeToolCalls?: boolean
  maxFullToolResults?: number
  debugMode?: boolean
}

export interface GetMessagesV2Result {
  messages: AgenticInputMessage[]
  conversationId: string | null
  truncated: boolean
}

interface MessageHistoryV2Params {
  last_message_id: string
  max_messages?: number
  include_tool_calls?: boolean
  max_full_tool_results?: number
  debug_mode?: boolean
}

export class HubtypeApiClient {
  private readonly authToken: string

  constructor(authToken: string) {
    this.authToken = authToken
  }

  async retrieveSimilarChunks(
    query: string,
    sourceIds: string[]
  ): Promise<Chunk[]> {
    const url = `${HUBTYPE_API_URL}/external/v1/ai/knowledge_base/similar_chunks/`
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    }
    const params = {
      query,
      source_ids: sourceIds,
      num_chunks: 5,
    }
    const response = await axios.post(url, params, { headers })
    const chunks = response.data.chunks.map((chunk: Chunk) => ({
      id: chunk.id,
      text: chunk.text,
    }))
    return chunks
  }

  async getLocalMessages(
    maxMemoryLength: number
  ): Promise<AgenticInputMessage[]> {
    const localBotonicState =
      typeof globalThis !== 'undefined' && globalThis.localStorage
        ? globalThis.localStorage.getItem('botonicState')
        : null
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

  async getMessagesV2(
    request: BotContext,
    options: GetMessagesV2Options = {}
  ): Promise<GetMessagesV2Result> {
    const url = `${HUBTYPE_API_URL}/external/v2/ai/agent/message_history/`
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    }
    const params: MessageHistoryV2Params = {
      last_message_id: request.input.message_id,
      ...(options.maxMessages !== undefined && {
        max_messages: options.maxMessages,
      }),
      ...(options.includeToolCalls !== undefined && {
        include_tool_calls: options.includeToolCalls,
      }),
      ...(options.maxFullToolResults !== undefined && {
        max_full_tool_results: options.maxFullToolResults,
      }),
      ...(options.debugMode !== undefined && {
        debug_mode: options.debugMode,
      }),
    }

    try {
      const response = await axios.get<MessageHistoryResponseV2>(url, {
        headers,
        params,
      })
      const { messages, conversation_id, truncated } = response.data
      const formattedMessages = messages
        .map(message => this.formatMessageV2(message))
        .filter((message): message is AgenticInputMessage => message !== null)
      return {
        messages: formattedMessages,
        conversationId: conversation_id,
        truncated,
      }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get messages from Hubtype V2 API')
    }
  }

  private formatMessageV2(
    message: HubtypeMessageV2
  ): AgenticInputMessage | null {
    switch (message.role) {
      case 'user':
        return {
          role: 'user',
          content: message.content ?? '',
        }
      case 'assistant': {
        const assistantMessage = message as HubtypeAssistantMessageV2
        // If assistant message has tool_calls, include them for context
        // Using double assertion as the OpenAI API supports this format,
        // but the agents SDK types are more restrictive
        if (
          assistantMessage.tool_calls &&
          assistantMessage.tool_calls.length > 0
        ) {
          return {
            role: 'assistant',
            content: assistantMessage.content ?? '',
            tool_calls: assistantMessage.tool_calls.map(tc => ({
              id: tc.id,
              type: tc.type,
              function: {
                name: tc.function.name,
                arguments: tc.function.arguments,
              },
            })),
          } as unknown as AgenticInputMessage
        }
        // Regular assistant message without tool_calls
        return {
          role: 'assistant',
          content: [
            {
              type: 'output_text',
              text: assistantMessage.content ?? '',
            },
          ],
          status: 'completed',
        }
      }
      case 'tool': {
        // Tool messages provide context about previous tool executions
        // Using double assertion as the OpenAI API supports this format,
        // but the agents SDK types are more restrictive
        const toolMessage = message as HubtypeToolMessageV2
        return {
          role: 'tool',
          tool_call_id: toolMessage.tool_call_id,
          content: toolMessage.content ?? '',
        } as unknown as AgenticInputMessage
      }
      case 'system':
        return {
          role: 'system',
          content: message.content ?? '',
        }
      default:
        throw new Error(
          `Invalid message role: ${(message as HubtypeMessageV2).role}`
        )
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
