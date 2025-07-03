import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import {
  AIMessage as LangchainAIMessage,
  ToolMessage as LangchainToolMessage,
} from '@langchain/core/messages'
import { StructuredTool } from '@langchain/core/tools'
import { CompiledStateGraph } from '@langchain/langgraph'
import { createReactAgent } from '@langchain/langgraph/prebuilt'

import { EXIT_TOOLS_NAMES } from './tools'
import {
  AgenticInputMessage,
  AgenticOutputMessage,
  AiAgentArgs,
  AssistantMessage,
  ExitMessage,
  ToolMessage,
} from './types'
import { createHubtypeAIAgent } from './ht-graph/graph'

export class AiAgentClient {
  public agent: CompiledStateGraph<any, any, any> // TODO: apply RunInput, RunOutput, etc.

  constructor(
    aiAgentArgs: AiAgentArgs,
    chatModel: BaseChatModel,
    tools: StructuredTool[] = []
  ) {
    this.agent = createHubtypeAIAgent(
      chatModel,
      tools,
      `${aiAgentArgs.instructions}\n\n## Metadata:\n- Current date: ${new Date().toLocaleDateString()}`
    )
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
    console.log('Structured Output Response')
    response.response.messages.map(m => console.log(m.type, m.content))
    const lastMessage = response.response.messages[0]
    return {
      role: 'assistant',
      content: lastMessage.content.text,
    } as AssistantMessage

    if (lastMessage instanceof LangchainToolMessage) {
      if (lastMessage.name && EXIT_TOOLS_NAMES.includes(lastMessage.name)) {
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
