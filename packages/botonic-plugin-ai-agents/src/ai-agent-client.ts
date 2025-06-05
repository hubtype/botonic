import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { ChatOpenAI } from '@langchain/openai'

import { OPENAI_API_KEY } from './constants'
import { AgenticMessage, AiAgentArgs } from './types'

export class AiAgentClient {
  public name: string
  public instructions: string

  constructor(aiAgentArgs: AiAgentArgs) {
    this.name = aiAgentArgs.name
    this.instructions = aiAgentArgs.instructions
  }

  async runAgent(_messages: AgenticMessage[]): Promise<AgenticMessage> {
    const model = new ChatOpenAI({
      model: 'gpt-4.1-mini',
      apiKey: OPENAI_API_KEY,
      temperature: 0,
      // other params...
    })
    console.log('model', model)

    const agent = createReactAgent({
      llm: model,
      tools: [],
      prompt: this.instructions,
    })

    console.log('agent', agent)

    const response = await agent.invoke({
      messages: _messages.map((message: AgenticMessage) => ({
        role: message.role,
        content: message.content,
      })),
    })

    console.log('agent invoke response', response)
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
