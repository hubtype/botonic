/* eslint-disable @typescript-eslint/naming-convention */
import type { BotContext, HubtypeAssistantMessage } from '@botonic/core'
import axios from 'axios'

import { HUBTYPE_API_URL } from '../constants'
import type { AgenticInputMessage, Chunk, MemoryOptions } from '../types'
import type {
  GetMessagesV2Result,
  HubtypeAssistantMessageV2,
  HubtypeMessage,
  HubtypeMessageV2,
  HubtypeToolMessageV2,
  MessageHistoryResponseV2,
  MessageHistoryV2Params,
  TrackLlmRunsData,
} from './types'

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
    maxMemoryLength: number,
    previousHubtypeMessages: HubtypeAssistantMessage[]
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
    const resultMessages = [...filteredMessages, ...previousHubtypeMessages]

    return resultMessages.slice(-maxMemoryLength)
  }

  async getMessagesV2(
    botContext: BotContext,
    options: MemoryOptions,
    previousHubtypeMessages: HubtypeAssistantMessage[]
  ): Promise<GetMessagesV2Result> {
    const url = `${HUBTYPE_API_URL}/external/v2/ai/agent/message_history/`
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    }
    const params: MessageHistoryV2Params = {
      last_message_id: botContext.input.message_id,
      max_messages: options.maxMessages,
      include_tool_calls: options.includeToolCalls,
      max_full_tool_results: options.maxFullToolResults,
      debug_mode: options.debugMode,
    }

    try {
      const response = await axios.get<MessageHistoryResponseV2>(url, {
        headers,
        params,
      })
      const { messages, conversation_id, truncated } = response.data
      const formattedMessages = [...messages, ...previousHubtypeMessages]
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

  async trackLlmRuns(botId: string, data: TrackLlmRunsData): Promise<void> {
    // Not stop the bot execution if the tracking fails, just log the error
    try {
      const url = `${HUBTYPE_API_URL}/external/v2/conversational_apps/${botId}/track_llm_runs/`
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authToken}`,
      }
      await axios.post(url, data, { headers })
    } catch (error) {
      console.error('Failed to track LLM runs:', error)
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
