import type { VerbosityLevel } from '@botonic/core'
import {
  type ModelProvider,
  type ModelSettings,
  OpenAIProvider,
} from '@openai/agents'
import OpenAI, { AzureOpenAI } from 'openai'
import {
  AZURE_OPENAI_API_BASE,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
  isProd,
  OPENAI_API_KEY,
  OPENAI_MODEL,
  OPENAI_PROVIDER,
} from './constants'

export class LLMConfig {
  private readonly maxRetries: number
  private readonly timeout: number
  public readonly modelName: string
  public readonly modelSettings: ModelSettings
  public readonly modelProvider: ModelProvider

  constructor(
    maxRetries: number,
    timeout: number,
    modelName: string,
    verbosity: VerbosityLevel
  ) {
    this.maxRetries = maxRetries
    this.timeout = timeout
    this.modelName = OPENAI_PROVIDER === 'openai' ? OPENAI_MODEL : modelName
    this.modelProvider = this.getModelProvider()
    this.modelSettings = this.getModelSettings(modelName, verbosity)
  }

  private getModelProvider(): ModelProvider {
    const client = this.getClient()
    return new OpenAIProvider({
      openAIClient: client,
      useResponses: false,
    })
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
    return new AzureOpenAI({
      apiKey: AZURE_OPENAI_API_KEY,
      apiVersion: AZURE_OPENAI_API_VERSION,
      deployment: this.modelName,
      baseURL: AZURE_OPENAI_API_BASE,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      dangerouslyAllowBrowser: !isProd,
    })
  }

  private getModelSettings(
    model: string,
    verbosity: VerbosityLevel
  ): ModelSettings {
    if (model.includes('gpt-5')) {
      return {
        reasoning: { effort: 'none' },
        temperature: 1,
        text: { verbosity },
      }
    }

    if (model.includes('gpt-4')) {
      return {
        temperature: 0,
        text: { verbosity },
      }
    }

    throw new Error(`Unsupported model: ${model}`)
  }
}
