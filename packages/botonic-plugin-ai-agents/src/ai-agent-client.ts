import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import {
  AIMessage as LangchainAIMessage,
  ToolMessage as LangchainToolMessage,
} from '@langchain/core/messages'
import { StructuredTool } from '@langchain/core/tools'
import { CompiledStateGraph } from '@langchain/langgraph'
import { createReactAgent } from '@langchain/langgraph/prebuilt'

import { EXIT_TOOLS } from './tools'
import {
  AgenticInputMessage,
  AgenticOutputMessage,
  AiAgentArgs,
  AssistantMessage,
  ExitMessage,
  ToolMessage,
} from './types'

export class AiAgentClient {
  public name: string
  public instructions: string
  public agent: CompiledStateGraph<any, any> // TODO: apply RunInput, RunOutput, etc.

  constructor(
    aiAgentArgs: AiAgentArgs,
    chatModel: BaseChatModel,
    tools: StructuredTool[] = []
  ) {
    this.name = aiAgentArgs.name
    this.instructions = aiAgentArgs.instructions

    this.agent = createReactAgent({
      llm: chatModel,
      tools: tools,
      prompt: this.instructions,
    })
  }

  async runAgent(
    _messages: AgenticInputMessage[]
  ): Promise<AgenticOutputMessage> {
    const response = await this.agent.invoke({
      messages: _messages.map((message: AgenticInputMessage) => ({
        role: message.role,
        content: message.content,
      })),
    })
    const lastMessage = response.messages.at(-1)

    if (lastMessage instanceof LangchainToolMessage) {
      if (lastMessage.name && EXIT_TOOLS.includes(lastMessage.name)) {
        return {
          role: 'exit',
        } as ExitMessage
      }
      return {
        role: 'tool',
        toolName: lastMessage.name,
        toolOutput: lastMessage.content,
      } as ToolMessage
    }

    if (lastMessage instanceof LangchainAIMessage) {
      return {
        role: 'assistant',
        content: lastMessage.content,
      } as AssistantMessage
    }

    throw new Error('Last message is not a valid message')
  }
}
