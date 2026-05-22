import type { BotContext, VerbosityLevel } from '@botonic/core'
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
  LITELLM_TAG_KEYS,
  LLM_PROVIDERS,
  isProd,
} from './constants'

export type LLMProvider = (typeof LLM_PROVIDERS)[keyof typeof LLM_PROVIDERS]

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
    this.modelName = modelName
    this.modelProvider = this.getModelProvider()
    this.modelSettings = this.getModelSettings(modelName, verbosity)
  }

  async getModel(): Promise<Model> {
    return await this.modelProvider.getModel(this.modelName)
  }

  getProviderName(): LLMProvider {
    return this.botContext.settings.LITELLM_API_URL
      ? LLM_PROVIDERS.LITELLM
      : LLM_PROVIDERS.AZURE
  }

  getApiVersion(): string | undefined {
    return this.getProviderName() === LLM_PROVIDERS.AZURE
      ? this.botContext.settings.AZURE_OPENAI_API_VERSION ||
          AZURE_OPENAI_API_VERSION
      : undefined
  }

  private getModelProvider(): ModelProvider {
    const client = this.getClient()
    return new OpenAIProvider({
      openAIClient: client,
      useResponses: false,
    })
  }

  private getClient(): OpenAI | AzureOpenAI {
    if (this.botContext.settings.LITELLM_API_URL) {
      return this.getLiteLLMClient()
    }

    return this.getAzureClient()
  }

  private buildLiteLLMTags(): { 'x-litellm-tags': string } | undefined {
    const botId = this.botContext.session.bot.id
    const orgId = this.botContext.session.organization_id
    const parts: string[] = []
    if (botId) {
      parts.push(`${LITELLM_TAG_KEYS.BOT_ID}:${botId}`)
    }
    if (orgId) {
      parts.push(`${LITELLM_TAG_KEYS.ORG_ID}:${orgId}`)
    }
    return parts.length > 0
      ? { 'x-litellm-tags': parts.join(LITELLM_TAG_KEYS.SEPARATOR) }
      : undefined
  }

  private getLiteLLMClient(): OpenAI {
    return new OpenAI({
      apiKey: this.botContext.secrets.LITELLM_API_KEY,
      baseURL: this.botContext.settings.LITELLM_API_URL,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      dangerouslyAllowBrowser: !isProd,
      defaultHeaders: this.buildLiteLLMTags(),
    })
  }

  private getAzureClient(): AzureOpenAI {
    return new AzureOpenAI({
      apiKey:
        this.botContext.secrets.AZURE_OPENAI_API_KEY || AZURE_OPENAI_API_KEY,
      apiVersion:
        this.botContext.settings.AZURE_OPENAI_API_VERSION ||
        AZURE_OPENAI_API_VERSION,
      deployment: this.modelName,
      baseURL:
        this.botContext.settings.AZURE_OPENAI_API_BASE || AZURE_OPENAI_API_BASE,
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
