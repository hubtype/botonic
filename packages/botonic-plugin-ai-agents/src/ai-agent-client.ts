import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { StructuredTool } from '@langchain/core/tools'
import { CompiledStateGraph } from '@langchain/langgraph'

import { createHubtypeAIAgent } from './graph'
import { MANDATORY_TOOLS } from './tools'
import { AgenticInputMessage, AgenticOutputMessage, AiAgentArgs } from './types'

export class AiAgentClient {
  public agent: CompiledStateGraph<any, any, any> // TODO: apply RunInput, RunOutput, State.

  constructor(
    aiAgentArgs: AiAgentArgs,
    chatModel: BaseChatModel,
    tools: StructuredTool[] = []
  ) {
    const finalTools = [...tools, ...MANDATORY_TOOLS]

    const instructions = `${aiAgentArgs.instructions}\n\n## Metadata:\n- Current date: ${new Date().toLocaleDateString()}`

    this.agent = createHubtypeAIAgent(chatModel, finalTools, instructions)
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
