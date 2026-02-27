import { ModelName } from '@botonic/core'
import {
  setDefaultOpenAIClient,
  setOpenAIAPI,
  setTracingDisabled,
} from '@openai/agents'
import OpenAI, { AzureOpenAI } from 'openai'

import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
  isProd,
  OPENAI_API_KEY,
  OPENAI_PROVIDER,
} from './constants'

export class OpenAiClientConfigurator {
  private readonly maxRetries: number
  private readonly timeout: number
  private readonly model: ModelName

  constructor(maxRetries: number, timeout: number, model: ModelName) {
    this.maxRetries = maxRetries
    this.timeout = timeout
    this.model = model
  }

  setUp(): void {
    const client = this.getClient()
    setDefaultOpenAIClient(client)
    setOpenAIAPI('chat_completions')
    setTracingDisabled(true)
  }

  private getClient(): OpenAI | AzureOpenAI {
    if (OPENAI_PROVIDER === 'openai') {
      return this.getOpenAIClient()
    }

    return this.getAzureClient()
  }

  private getOpenAIClient(): OpenAI {
    return new OpenAI({
      apiKey: OPENAI_API_KEY,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      dangerouslyAllowBrowser: !isProd,
    })
  }

  private getAzureClient(): AzureOpenAI {
    const deploymentName = this.getAzureDeploymentName()

    return new AzureOpenAI({
      apiKey: AZURE_OPENAI_API_KEY,
      apiVersion: AZURE_OPENAI_API_VERSION,
      deployment: deploymentName,
      baseURL: AZURE_OPENAI_API_BASE,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      dangerouslyAllowBrowser: !isProd,
    })
  }

  private getAzureDeploymentName(): string {
    switch (this.model) {
      case ModelName.Gpt41Mini:
        return 'gpt-41-mini_p1'
      case ModelName.Gpt5Mini:
        return 'gpt-5-mini_p1'
      case ModelName.Gpt52Chat:
        return 'gpt-52-chat_p1'
      default:
        throw new Error(`Unsupported model: ${this.model}`)
    }
  }
}
