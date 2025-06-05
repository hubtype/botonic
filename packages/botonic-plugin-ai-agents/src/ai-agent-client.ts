import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { AzureChatOpenAI } from '@langchain/openai'

import { StructuredTool } from '@langchain/core/tools'
import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
} from './constants'
import { AgenticMessage, AiAgentArgs } from './types'

export class AiAgentClient {
  public name: string
  public instructions: string
  public tools: StructuredTool[]

  constructor(aiAgentArgs: AiAgentArgs, tools: StructuredTool[] = []) {
    this.name = aiAgentArgs.name
    this.instructions = aiAgentArgs.instructions
    this.tools = tools
  }

  async runAgent(_messages: AgenticMessage[]): Promise<AgenticMessage> {
    const model = new AzureChatOpenAI({
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
      azureOpenAIApiDeploymentName: AZURE_OPENAI_API_DEPLOYMENT_NAME,
      azureOpenAIEndpoint: AZURE_OPENAI_API_BASE,
      temperature: 0,
      // other params...
    })

    const agent = createReactAgent({
      llm: model,
      tools: this.tools,
      prompt: this.instructions,
    })

    const response = await agent.invoke({
      messages: _messages.map((message: AgenticMessage) => ({
        role: message.role,
        content: message.content,
      })),
    })

    const content = response.messages.at(-1)?.content

    if (typeof content !== 'string') {
      throw new Error('Content is not a string')
    }

    return {
      role: 'assistant',
      content: content,
    }
  }
}
