import { VerbosityLevel } from '@botonic/core'
import { createTestBotContext } from '@botonic/core/testing'
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'

import { LLMConfig } from '../src/llm-config'

const DEFAULT_MAX_RETRIES = 2
const DEFAULT_TIMEOUT = 16000

let capturedOpenAIConfig: Record<string, unknown> | null = null
let capturedAzureConfig: Record<string, unknown> | null = null
const mockResolvedModel = { id: 'resolved-model' }

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((config: Record<string, unknown>) => {
    capturedOpenAIConfig = config
    return { type: 'openai' }
  }),
  AzureOpenAI: jest
    .fn()
    .mockImplementation((config: Record<string, unknown>) => {
      capturedAzureConfig = config
      return { type: 'azure' }
    }),
}))

jest.mock('@openai/agents', () => ({
  OpenAIProvider: jest.fn().mockImplementation(() => ({
    type: 'provider',
    getModel: jest.fn().mockResolvedValue(mockResolvedModel),
  })),
}))

// var so the variable is hoisted and assignable when the mock factory runs (Jest hoists mocks)
// eslint-disable-next-line no-var
var mockConstants: {
  LLM_PROVIDERS: { OPENAI: 'openai'; AZURE: 'azure' }
  LLM_PROVIDER: 'openai' | 'azure'
  LLM_OPENAI_MODEL: string
  LLM_API_KEY: string
  LLM_API_URL: string
  LLM_AZURE_API_VERSION: string
  isProd: boolean
}
jest.mock('../src/constants', () => {
  mockConstants = {
    LLM_PROVIDERS: { OPENAI: 'openai', AZURE: 'azure' },
    LLM_PROVIDER: 'azure',
    LLM_OPENAI_MODEL: 'gpt-4.1-mini',
    LLM_API_KEY: 'fallback-key',
    LLM_API_URL: 'https://fallback.openai.azure.com',
    LLM_AZURE_API_VERSION: '2025-01-01-preview',
    isProd: false,
  }
  return mockConstants
})

function makeBotContext(
  settings: Partial<{ AZURE_OPENAI_API_BASE: string; AZURE_OPENAI_API_VERSION: string }> = {},
  secrets: Partial<{ AZURE_OPENAI_API_KEY: string }> = {}
) {
  return createTestBotContext({
    settings: { ...settings } as any,
    secrets: { ...secrets } as any,
  })
}

describe('LLMConfig', () => {
  const originalEnv = process.env

  beforeEach(() => {
    capturedOpenAIConfig = null
    capturedAzureConfig = null
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('modelName', () => {
    it('uses LLM_OPENAI_MODEL when provider is openai', () => {
      mockConstants.LLM_PROVIDER = 'openai'

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      expect(config.modelName).toBe('gpt-4.1-mini')
    })

    it('uses passed modelName (deployment) when provider is azure', () => {
      mockConstants.LLM_PROVIDER = 'azure'

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      expect(config.modelName).toBe('gpt-4.1-mini')
    })
  })

  describe('modelSettings', () => {
    beforeEach(() => {
      mockConstants.LLM_PROVIDER = 'azure'
    })

    it('returns gpt-4 style settings for gpt-4 model', () => {
      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      expect(config.modelSettings).toEqual({
        temperature: 0,
        text: { verbosity: 'medium' },
      })
    })

    it('returns gpt-5 style settings for gpt-5 model', () => {
      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-5-mini',
        verbosity: VerbosityLevel.High,
        botContext: makeBotContext(),
      })

      expect(config.modelSettings).toEqual({
        reasoning: { effort: 'none' },
        temperature: 1,
        text: { verbosity: 'high' },
      })
    })

    it('throws for unsupported model', () => {
      expect(
        () =>
          new LLMConfig({
            maxRetries: DEFAULT_MAX_RETRIES,
            timeout: DEFAULT_TIMEOUT,
            modelName: 'unknown-model',
            verbosity: VerbosityLevel.Medium,
            botContext: makeBotContext(),
          })
      ).toThrow('Unsupported model: unknown-model')
    })
  })

  describe('Azure client configuration', () => {
    beforeEach(() => {
      mockConstants.LLM_PROVIDER = 'azure'
    })

    it('uses botContext secrets and settings when provided', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          {
            AZURE_OPENAI_API_BASE: 'https://platform.openai.azure.com',
            AZURE_OPENAI_API_VERSION: '2026-01-01',
          },
          { AZURE_OPENAI_API_KEY: 'platform-key' }
        ),
      })

      expect(capturedAzureConfig?.apiKey).toBe('platform-key')
      expect(capturedAzureConfig?.baseURL).toBe('https://platform.openai.azure.com')
      expect(capturedAzureConfig?.apiVersion).toBe('2026-01-01')
    })

    it('falls back to LLM_* constants when botContext settings are empty', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          { AZURE_OPENAI_API_BASE: '', AZURE_OPENAI_API_VERSION: '' },
          { AZURE_OPENAI_API_KEY: '' }
        ),
      })

      expect(capturedAzureConfig?.apiKey).toBe('fallback-key')
      expect(capturedAzureConfig?.baseURL).toBe('https://fallback.openai.azure.com')
      expect(capturedAzureConfig?.apiVersion).toBe('2025-01-01-preview')
    })

    it('botContext takes priority over LLM_* fallbacks', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          { AZURE_OPENAI_API_BASE: 'https://platform.openai.azure.com' },
          { AZURE_OPENAI_API_KEY: 'platform-key' }
        ),
      })

      expect(capturedAzureConfig?.apiKey).toBe('platform-key')
      expect(capturedAzureConfig?.baseURL).toBe('https://platform.openai.azure.com')
    })

    it('sets deployment and timeout', () => {
      new LLMConfig({
        maxRetries: 5,
        timeout: 30000,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      expect(capturedAzureConfig?.deployment).toBe('gpt-4.1-mini')
      expect(capturedAzureConfig?.timeout).toBe(30000)
      expect(capturedAzureConfig?.maxRetries).toBe(5)
    })
  })

  describe('OpenAI client configuration', () => {
    beforeEach(() => {
      mockConstants.LLM_PROVIDER = 'openai'
    })

    it('uses botContext secret when provided', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext({}, { AZURE_OPENAI_API_KEY: 'platform-openai-key' }),
      })

      expect(capturedOpenAIConfig?.apiKey).toBe('platform-openai-key')
    })

    it('falls back to LLM_API_KEY constant when botContext secret is empty', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext({}, { AZURE_OPENAI_API_KEY: '' }),
      })

      expect(capturedOpenAIConfig?.apiKey).toBe('fallback-key')
    })

    it('sets timeout and maxRetries', () => {
      new LLMConfig({
        maxRetries: 5,
        timeout: 30000,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      expect(capturedOpenAIConfig?.timeout).toBe(30000)
      expect(capturedOpenAIConfig?.maxRetries).toBe(5)
    })
  })

  describe('getApiVersion', () => {
    it('returns version from botContext when provider is azure', () => {
      mockConstants.LLM_PROVIDER = 'azure'

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext({ AZURE_OPENAI_API_VERSION: '2026-01-01' }),
      })

      expect(config.getApiVersion()).toBe('2026-01-01')
    })

    it('falls back to LLM_AZURE_API_VERSION constant when botContext version is empty', () => {
      mockConstants.LLM_PROVIDER = 'azure'

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext({ AZURE_OPENAI_API_VERSION: '' }),
      })

      expect(config.getApiVersion()).toBe('2025-01-01-preview')
    })

    it('returns NOT_API_VERSION_FOR_OPENAI_PROVIDER when provider is openai', () => {
      mockConstants.LLM_PROVIDER = 'openai'

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      expect(config.getApiVersion()).toBe('NOT_API_VERSION_FOR_OPENAI_PROVIDER')
    })
  })

  describe('getModel', () => {
    it('resolves model from the configured provider', async () => {
      mockConstants.LLM_PROVIDER = 'azure'

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      await expect(config.getModel()).resolves.toBe(mockResolvedModel)
      expect(config.modelProvider.getModel).toHaveBeenCalledWith('gpt-4.1-mini')
    })
  })
})
