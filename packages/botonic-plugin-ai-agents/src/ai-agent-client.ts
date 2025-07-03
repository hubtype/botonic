import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { StructuredTool } from '@langchain/core/tools'
import { CompiledStateGraph } from '@langchain/langgraph'

import { createHubtypeAIAgent } from './graph'
import { AgenticInputMessage, AgenticOutputMessage, AiAgentArgs } from './types'

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
      aiAgentArgs.instructions
    )
  }

  async runAgent(
    messages: AgenticInputMessage[]
  ): Promise<AgenticOutputMessage[]> {
    const response = await this.agent.invoke({
      messages,
    })
    return response.output as AgenticOutputMessage[]
  }
}
