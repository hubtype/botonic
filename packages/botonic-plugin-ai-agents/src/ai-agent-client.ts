import {
  AIMessage as LangchainAIMessage,
  ToolMessage as LangchainToolMessage,
} from '@langchain/core/messages'
import { StructuredTool } from '@langchain/core/tools'
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { AzureChatOpenAI } from '@langchain/openai'
import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
} from './constants'
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
  public tools: StructuredTool[]

  constructor(aiAgentArgs: AiAgentArgs, tools: StructuredTool[] = []) {
    this.name = aiAgentArgs.name
    this.instructions = aiAgentArgs.instructions
    this.tools = tools
  }

  async runAgent(
    _messages: AgenticInputMessage[]
  ): Promise<AgenticOutputMessage> {
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
        tool_name: lastMessage.name,
        tool_output: lastMessage.content,
      } as ToolMessage
    }

    if (lastMessage instanceof LangchainAIMessage) {
      const content = lastMessage?.content
      if (typeof content !== 'string') {
        throw new Error('Content is not a string')
      }
      return {
        role: 'assistant',
        content: lastMessage.content,
      } as AssistantMessage
    }

    throw new Error('Last message is not a valid message')
  }
}
