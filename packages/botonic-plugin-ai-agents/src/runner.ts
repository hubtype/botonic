import {
  Agent,
  ModelBehaviorError,
  Runner,
  setDefaultOpenAIClient,
  setOpenAIAPI,
  setTracingDisabled,
  Tool,
} from '@openai/agents'
import { AzureOpenAI } from 'openai'

import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
  isProd,
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
        dangerouslyAllowBrowser: !isProd,
      })
      setDefaultOpenAIClient(client as any)
      setOpenAIAPI('chat_completions')
      setTracingDisabled(true)
    }

    this.agent = new Agent({
      name: name,
      instructions: this.addExtraInstructions(instructions),
      tools: tools,
      outputType: OutputSchema,
    })
  }

  async run(
    messages: AgenticInputMessage[],
    maxRetries: number = 1
  ): Promise<OutputMessage[]> {
    return this.runWithRetry(messages, maxRetries, 1)
  }

  private async runWithRetry(
    messages: AgenticInputMessage[],
    maxRetries: number,
    attempt: number
  ): Promise<OutputMessage[]> {
    try {
      const runner = new Runner({
        modelSettings: { temperature: 0 },
      })
      const result = await runner.run(this.agent, messages)
      return result.finalOutput?.messages || []
    } catch (error) {
      if (!(error instanceof ModelBehaviorError)) {
        throw error
      }
      if (attempt > maxRetries) {
        throw error
      }
      console.warn(
        `AI Agent execution failed due to ModelBehaviorError. Retrying... (Attempt ${attempt}/${maxRetries})`
      )
      return this.runWithRetry(messages, maxRetries, attempt + 1)
    }
  }

  private addExtraInstructions(instructions: string): string {
    const metadata = `Current Date: ${new Date().toISOString()}`

    const outputExample = JSON.stringify({
      messages: [
        {
          type: 'text',
          content: {
            text: 'Hello, how can I help you today?',
          },
        },
      ],
      numMessages: 1,
    })
    const output = `Return a JSON that follows the output schema provided. Never return multiple output schemas concatenated by a line break.\n<example>\n${outputExample}\n</example>`

    return `<instructions>\n${instructions}\n</instructions>\n\n<metadata>\n${metadata}\n</metadata>\n\n<output>\n${output}\n</output>`
  }
}
