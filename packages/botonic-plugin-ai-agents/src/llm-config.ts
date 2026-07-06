import { type BotContext, ReasoningEffort, VerbosityLevel } from '@botonic/core'
import {
  type Model,
  type ModelProvider,
  type ModelSettings,
  OpenAIProvider,
} from '@openai/agents'
import OpenAI, { AzureOpenAI } from 'openai'
import {
  isProd,
  LITELLM_TAG_KEYS,
  LLM_API_KEY,
  LLM_API_URL,
  LLM_AZURE_API_VERSION,
  LLM_OPENAI_MODEL,
  LLM_PROVIDER,
  LLM_PROVIDERS,
  type LLMProviderType,
} from './constants'
import { setTraceProcessor } from './trace-processor'

export interface LLMConfigParams {
  maxRetries: number
  timeout: number
  modelName: string
  verbosity: VerbosityLevel
  botContext: BotContext
  reasoningEffort?: ReasoningEffort
}

export class LLMConfig {
  private readonly maxRetries: number
  private readonly timeout: number
  private readonly botContext: BotContext
  public readonly modelName: string
  public readonly modelSettings: ModelSettings
  public readonly modelProvider: ModelProvider
  public readonly reasoningEffort?: ReasoningEffort

  constructor({
    maxRetries,
    timeout,
    modelName,
    verbosity,
    botContext,
    reasoningEffort,
  }: LLMConfigParams) {
    this.maxRetries = maxRetries
    this.timeout = timeout
    this.botContext = botContext
    this.modelName =
      LLM_PROVIDER === LLM_PROVIDERS.OPENAI ? LLM_OPENAI_MODEL : modelName
    this.modelProvider = this.getModelProvider()
    this.modelSettings = this.getModelSettings(modelName, verbosity)
    this.reasoningEffort = reasoningEffort
  }

  async getModel(): Promise<Model> {
    return await this.modelProvider.getModel(this.modelName)
  }

  private getModelProvider(): ModelProvider {
    const client = this.getClient()
    setTraceProcessor(client)
    return new OpenAIProvider({
      openAIClient: client,
      useResponses: false,
    })
  }

  getProviderName(): LLMProviderType {
    if (
      this.botContext.settings.LITELLM_API_URL ||
      LLM_PROVIDER === LLM_PROVIDERS.LITELLM
    ) {
      return LLM_PROVIDERS.LITELLM
    }
    return LLM_PROVIDER
  }

  private getClient(): OpenAI | AzureOpenAI {
    if (this.getProviderName() === LLM_PROVIDERS.LITELLM) {
      const litellmUrl =
        this.botContext.settings.LITELLM_API_URL || LLM_API_URL || ''
      return this.getLiteLLMClient(litellmUrl)
    }
    if (LLM_PROVIDER === LLM_PROVIDERS.OPENAI) {
      return this.getOpenAIClient()
    }
    return this.getAzureOpenAiClient()
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

  private getLiteLLMClient(litellmUrl: string): OpenAI {
    return new OpenAI({
      apiKey: this.botContext.secrets.LITELLM_API_KEY || LLM_API_KEY,
      baseURL: litellmUrl,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      dangerouslyAllowBrowser: !isProd,
      defaultHeaders: this.buildLiteLLMTags(),
    })
  }

  private getOpenAIClient(): OpenAI {
    return new OpenAI({
      apiKey: this.botContext.secrets.AZURE_OPENAI_API_KEY || LLM_API_KEY,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      dangerouslyAllowBrowser: !isProd,
    })
  }

  private getAzureOpenAiClient(): AzureOpenAI {
    const baseURL = `${this.botContext.settings.AZURE_OPENAI_API_BASE || LLM_API_URL}openai/`

    return new AzureOpenAI({
      apiKey: this.botContext.secrets.AZURE_OPENAI_API_KEY || LLM_API_KEY,
      apiVersion:
        this.botContext.settings.AZURE_OPENAI_API_VERSION ||
        LLM_AZURE_API_VERSION,
      deployment: this.modelName,
      baseURL,
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
        reasoning: { effort: this.reasoningEffort ?? ReasoningEffort.Medium },
        temperature: 1,
        text: { verbosity },
      }
    }

    if (model.includes('gpt-4')) {
      return {
        temperature: 0,
        text: { verbosity: VerbosityLevel.Medium },
      }
    }

    // LiteLLM can proxy any model — fall back to reasoning settings
    return {
      reasoning: { effort: ReasoningEffort.None },
      temperature: 1,
      text: { verbosity },
    }
  }

  getApiVersion(): string | undefined {
    if (this.getProviderName() === LLM_PROVIDERS.LITELLM) {
      return undefined
    }
    if (LLM_PROVIDER !== LLM_PROVIDERS.AZURE) {
      return 'NOT_API_VERSION_FOR_OPENAI_PROVIDER'
    }
    return (
      this.botContext.settings.AZURE_OPENAI_API_VERSION || LLM_AZURE_API_VERSION
    )
  }
}
