import {
  Agent,
  Runner,
  setDefaultOpenAIClient,
  setOpenAIAPI,
  Tool,
} from '@openai/agents'
import { AzureOpenAI } from 'openai'

import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
} from './constants'
import { OutputMessage, OutputSchema } from './structured-output'
import { AgenticInputMessage } from './types'

export class AIAgentRunner {
  private agent: Agent<any, typeof OutputSchema>

  constructor(name: string, instructions: string, tools: Tool[]) {
    if (AZURE_OPENAI_API_KEY) {
      const client = new AzureOpenAI({
        apiKey: AZURE_OPENAI_API_KEY,
        apiVersion: AZURE_OPENAI_API_VERSION,
        deployment: AZURE_OPENAI_API_DEPLOYMENT_NAME,
        baseURL: AZURE_OPENAI_API_BASE,
        dangerouslyAllowBrowser: true,
      })
      setDefaultOpenAIClient(client as any)
      setOpenAIAPI('chat_completions')
    }
    this.agent = new Agent({
      name: name,
      instructions: instructions,
      tools: tools,
      outputType: OutputSchema,
    })
  }

  async run(messages: AgenticInputMessage[]): Promise<OutputMessage[]> {
    const runner = new Runner({
      model: 'gpt-4.1-mini',
      modelSettings: { temperature: 0 },
    })
    const result = await runner.run(this.agent, messages)
    const finalOutput = result.finalOutput
    return finalOutput?.messages || []
  }
}
