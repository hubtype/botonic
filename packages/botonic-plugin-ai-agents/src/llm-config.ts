import type { BotSecrets, BotSettings, VerbosityLevel } from '@botonic/core'
import {
  type Model,
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
} from './constants'

export type LLMProvider = 'litellm' | 'azure'

export class LLMConfig {
  private readonly maxRetries: number
  private readonly timeout: number
  private readonly settings: BotSettings
  private readonly secrets: BotSecrets
  private readonly botId?: string
  private readonly orgId?: string
  public readonly modelName: string
  public readonly modelSettings: ModelSettings
  public readonly modelProvider: ModelProvider

  constructor(
    maxRetries: number,
    timeout: number,
    modelName: string,
    verbosity: VerbosityLevel,
    settings: BotSettings,
    secrets: BotSecrets,
    botId?: string,
    orgId?: string
  ) {
    this.maxRetries = maxRetries
    this.timeout = timeout
    this.settings = settings
    this.secrets = secrets
    this.modelName = modelName
    this.botId = botId
    this.orgId = orgId
    this.modelProvider = this.getModelProvider()
    this.modelSettings = this.getModelSettings(modelName, verbosity)
  }

  async getModel(): Promise<Model> {
    return await this.modelProvider.getModel(this.modelName)
  }

  getProviderName(): LLMProvider {
    return this.settings.LITELLM_API_URL ? 'litellm' : 'azure'
  }

  getApiVersion(): string {
    return this.getProviderName() === 'azure'
      ? this.settings.AZURE_OPENAI_API_VERSION || AZURE_OPENAI_API_VERSION
      : 'NOT_API_VERSION_FOR_LITELLM_PROVIDER'
  }

  private getModelProvider(): ModelProvider {
    const client = this.getClient()
    return new OpenAIProvider({
      openAIClient: client,
      useResponses: false,
    })
  }

  private getClient(): OpenAI | AzureOpenAI {
    if (this.settings.LITELLM_API_URL) {
      return this.getLiteLLMClient()
    }

    return this.getAzureClient()
  }

  private buildLiteLLMTags(): { 'x-litellm-tags': string } | undefined {
    const parts: string[] = []
    if (this.botId) {
      parts.push(`bot_id:${this.botId}`)
    }
    if (this.orgId) {
      parts.push(`org_id:${this.orgId}`)
    }
    return parts.length > 0 ? { 'x-litellm-tags': parts.join(',') } : undefined
  }

  private getLiteLLMClient(): OpenAI {
    return new OpenAI({
      apiKey: this.secrets.LITELLM_API_KEY,
      baseURL: this.settings.LITELLM_API_URL,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      dangerouslyAllowBrowser: !isProd,
      defaultHeaders: this.buildLiteLLMTags(),
    })
  }

  private getAzureClient(): AzureOpenAI {
    return new AzureOpenAI({
      apiKey: this.secrets.AZURE_OPENAI_API_KEY || AZURE_OPENAI_API_KEY,
      apiVersion:
        this.settings.AZURE_OPENAI_API_VERSION || AZURE_OPENAI_API_VERSION,
      deployment: this.modelName,
      baseURL: this.settings.AZURE_OPENAI_API_BASE || AZURE_OPENAI_API_BASE,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      dangerouslyAllowBrowser: !isProd,
    })
  }

  private getModelSettings(
    model: string,
    verbosity: VerbosityLevel
  ): ModelSettings {
    if (model.includes('gpt-4')) {
      return {
        temperature: 0,
        text: { verbosity: 'medium' },
      }
    }

    return {
      reasoning: { effort: 'none' },
      temperature: 1,
      text: { verbosity },
    }
  }
}
