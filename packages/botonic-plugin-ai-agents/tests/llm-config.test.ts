import { VerbosityLevel } from '@botonic/core'
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'

import { LLMConfig } from '../src/llm-config'

const DEFAULT_MAX_RETRIES = 2
const DEFAULT_TIMEOUT = 16000
const DEFAULT_VERBOSITY = VerbosityLevel.Medium

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

jest.mock('../src/constants', () => ({
  AZURE_OPENAI_API_KEY: 'test-azure-key',
  AZURE_OPENAI_API_BASE: 'https://test.openai.azure.com',
  AZURE_OPENAI_API_VERSION: '2025-01-01-preview',
  isProd: false,
}))

const makeSettings = (overrides = {}) => ({
  HUBTYPE_API_URL: 'https://api.hubtype.com',
  STATIC_URL: '',
  LITELLM_API_URL: '',
  AZURE_OPENAI_API_BASE: '',
  AZURE_OPENAI_API_VERSION: '',
  CUSTOM_SHORT_URL_HOST: null,
  custom: {},
  ...overrides,
})

const makeSecrets = (overrides = {}) => ({
  HUBTYPE_ACCESS_TOKEN: 'test-token',
  LITELLM_API_KEY: 'test-litellm-key',
  AZURE_OPENAI_API_KEY: 'test-azure-key',
  custom: {},
  ...overrides,
})

const litellmSettings = makeSettings({
  LITELLM_API_URL: 'https://litellm.example.com',
})

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

  describe('provider selection', () => {
    it('should use litellm when LITELLM_API_URL is set', () => {
      const config = new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        litellmSettings,
        makeSecrets()
      )
      expect(config.getProviderName()).toBe('litellm')
    })

    it('should use azure when LITELLM_API_URL is not set', () => {
      const config = new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        makeSettings(),
        makeSecrets()
      )
      expect(config.getProviderName()).toBe('azure')
    })
  })

  describe('LiteLLM client tags', () => {
    it('should set bot_id and org_id when both are provided', () => {
      new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        litellmSettings,
        makeSecrets(),
        'bot-123',
        'org-456'
      )
      expect(capturedOpenAIConfig?.defaultHeaders).toEqual({
        'x-litellm-tags': 'bot_id:bot-123,org_id:org-456',
      })
    })

    it('should set only bot_id when only botId is provided', () => {
      new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        litellmSettings,
        makeSecrets(),
        'bot-123'
      )
      expect(capturedOpenAIConfig?.defaultHeaders).toEqual({
        'x-litellm-tags': 'bot_id:bot-123',
      })
    })

    it('should set only org_id when only orgId is provided', () => {
      new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        litellmSettings,
        makeSecrets(),
        undefined,
        'org-456'
      )
      expect(capturedOpenAIConfig?.defaultHeaders).toEqual({
        'x-litellm-tags': 'org_id:org-456',
      })
    })

    it('should not set defaultHeaders when neither botId nor orgId is provided', () => {
      new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        litellmSettings,
        makeSecrets()
      )
      expect(capturedOpenAIConfig?.defaultHeaders).toBeUndefined()
    })
  })

  describe('Azure client', () => {
    it('should not set defaultHeaders even when botId and orgId are provided', () => {
      new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        makeSettings(),
        makeSecrets(),
        'bot-123',
        'org-456'
      )
      expect(capturedAzureConfig).toBeDefined()
      expect(capturedAzureConfig?.defaultHeaders).toBeUndefined()
    })

    it('should set deployment and apiVersion', () => {
      new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        makeSettings(),
        makeSecrets()
      )
      expect(capturedAzureConfig?.deployment).toBe('gpt-4.1-mini')
      expect(capturedAzureConfig?.baseURL).toBe('https://test.openai.azure.com')
      expect(capturedAzureConfig?.apiVersion).toBe('2025-01-01-preview')
    })
  })

  describe('modelSettings', () => {
    it('should return gpt-4 style settings for gpt-4 model', () => {
      const config = new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        makeSettings(),
        makeSecrets()
      )
      expect(config.modelSettings).toEqual({
        temperature: 0,
        text: { verbosity: 'medium' },
      })
    })
  })

  describe('getApiVersion', () => {
    it('should return the configured Azure api version', () => {
      const config = new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        makeSettings({ AZURE_OPENAI_API_VERSION: '2025-01-01-preview' }),
        makeSecrets()
      )
      expect(config.getApiVersion()).toBe('2025-01-01-preview')
    })

    it('should return NOT_API_VERSION_FOR_LITELLM_PROVIDER for litellm', () => {
      const config = new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        litellmSettings,
        makeSecrets()
      )
      expect(config.getApiVersion()).toBe(
        'NOT_API_VERSION_FOR_LITELLM_PROVIDER'
      )
    })
  })

  describe('getModel', () => {
    it('should resolve model from the configured provider', async () => {
      const config = new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        DEFAULT_VERBOSITY,
        makeSettings(),
        makeSecrets()
      )
      await expect(config.getModel()).resolves.toBe(mockResolvedModel)
      expect(config.modelProvider.getModel).toHaveBeenCalledWith('gpt-4.1-mini')
    })
  })
})
