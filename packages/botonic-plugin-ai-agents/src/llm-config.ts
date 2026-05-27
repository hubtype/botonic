import type { BotContext, VerbosityLevel } from '@botonic/core'
import {
  type Model,
  type ModelProvider,
  type ModelSettings,
  OpenAIProvider,
} from '@openai/agents'
import OpenAI, { AzureOpenAI } from 'openai'
import {
  isProd,
  LLM_API_BASE,
  LLM_API_KEY,
  LLM_API_VERSION,
  LLM_PROVIDER,
  OPENAI_MODEL,
} from './constants'

export class LLMConfig {
  private readonly maxRetries: number
  private readonly timeout: number
  private readonly botContext: BotContext
  public readonly modelName: string
  public readonly modelSettings: ModelSettings
  public readonly modelProvider: ModelProvider

  constructor(
    maxRetries: number,
    timeout: number,
    modelName: string,
    verbosity: VerbosityLevel,
    botContext: BotContext
  ) {
    this.maxRetries = maxRetries
    this.timeout = timeout
    this.botContext = botContext
    this.modelName = LLM_PROVIDER === 'openai' ? OPENAI_MODEL : modelName
    this.modelProvider = this.getModelProvider()
    this.modelSettings = this.getModelSettings(modelName, verbosity)
  }

  async getModel(): Promise<Model> {
    return await this.modelProvider.getModel(this.modelName)
  }

  private getModelProvider(): ModelProvider {
    const client = this.getClient()
    return new OpenAIProvider({
      openAIClient: client,
      useResponses: false,
    })
  }

  private getClient(): OpenAI | AzureOpenAI {
    if (LLM_PROVIDER === 'openai') {
      return this.getOpenAIClient()
    }

    return this.getAzureClient()
  }

  private getOpenAIClient(): OpenAI {
    return new OpenAI({
      apiKey: this.botContext.secrets.AZURE_OPENAI_API_KEY || LLM_API_KEY,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      dangerouslyAllowBrowser: !isProd,
    })
  }

  private getAzureClient(): AzureOpenAI {
    return new AzureOpenAI({
      apiKey:
        this.botContext.secrets.AZURE_OPENAI_API_KEY || LLM_API_KEY,
      apiVersion:
        this.botContext.settings.AZURE_OPENAI_API_VERSION || LLM_API_VERSION,
      deployment: this.modelName,
      baseURL:
        this.botContext.settings.AZURE_OPENAI_API_BASE || LLM_API_BASE,
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
        text: { verbosity: 'medium' },
      }
    }

    throw new Error(`Unsupported model: ${model}`)
  }

  getApiVersion(): string {
    if (LLM_PROVIDER !== 'azure') {
      return 'NOT_API_VERSION_FOR_OPENAI_PROVIDER'
    }
    return (
      this.botContext.settings.AZURE_OPENAI_API_VERSION || LLM_API_VERSION
    )
  }
}
