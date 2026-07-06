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
  LLM_PROVIDERS: { OPENAI: 'openai'; AZURE: 'azure'; LITELLM: 'litellm' }
  LLM_PROVIDER: 'openai' | 'azure' | 'litellm'
  LLM_OPENAI_MODEL: string
  LLM_API_KEY: string
  LLM_API_URL: string
  LLM_AZURE_API_VERSION: string
  isProd: boolean
  LITELLM_TAG_KEYS: { BOT_ID: 'bot_id'; ORG_ID: 'org_id'; SEPARATOR: ',' }
}
jest.mock('../src/constants', () => {
  mockConstants = {
    LLM_PROVIDERS: { OPENAI: 'openai', AZURE: 'azure', LITELLM: 'litellm' },
    LLM_PROVIDER: 'azure',
    LLM_OPENAI_MODEL: 'gpt-4.1-mini',
    LLM_API_KEY: 'fallback-key',
    LLM_API_URL: '',
    LLM_AZURE_API_VERSION: '2025-01-01-preview',
    isProd: false,
    LITELLM_TAG_KEYS: { BOT_ID: 'bot_id', ORG_ID: 'org_id', SEPARATOR: ',' },
  }
  return mockConstants
})

function makeBotContext(
  settings: Partial<{
    AZURE_OPENAI_API_BASE: string
    AZURE_OPENAI_API_VERSION: string
    LITELLM_API_URL: string
  }> = {},
  secrets: Partial<{
    AZURE_OPENAI_API_KEY: string
    LITELLM_API_KEY: string
  }> = {},
  session: Partial<{ botId: string; organizationId: string }> = {}
) {
  return createTestBotContext({
    settings: { LITELLM_API_URL: '', ...settings } as any,
    secrets: { ...secrets } as any,
    session: { ...session },
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

    it('returns gpt-chat style settings for gpt-chat model', () => {
      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-chat-latest',
        verbosity: VerbosityLevel.High,
        botContext: makeBotContext(),
      })

      expect(config.modelSettings).toEqual({
        reasoning: { effort: 'low' },
        temperature: 1,
        text: { verbosity: 'high' },
      })
    })

    it('returns reasoning settings for unknown model (LiteLLM fallback)', () => {
      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.High,
        botContext: makeBotContext(),
      })

      expect(config.modelSettings).toEqual({
        reasoning: { effort: 'none' },
        temperature: 1,
        text: { verbosity: 'high' },
      })
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
            AZURE_OPENAI_API_BASE: 'https://platform.openai.azure.com/',
            AZURE_OPENAI_API_VERSION: '2026-01-01',
          },
          { AZURE_OPENAI_API_KEY: 'platform-key' }
        ),
      })

      expect(capturedAzureConfig?.apiKey).toBe('platform-key')
      expect(capturedAzureConfig?.baseURL).toBe(
        'https://platform.openai.azure.com/openai/'
      )
      expect(capturedAzureConfig?.apiVersion).toBe('2026-01-01')
    })

    it('falls back to LLM_* constants when botContext settings are empty', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          {
            AZURE_OPENAI_API_BASE: 'https://fallback.openai.azure.com/',
            AZURE_OPENAI_API_VERSION: '',
          },
          { AZURE_OPENAI_API_KEY: '' }
        ),
      })

      expect(capturedAzureConfig?.apiKey).toBe('fallback-key')
      expect(capturedAzureConfig?.baseURL).toBe(
        'https://fallback.openai.azure.com/openai/'
      )
      expect(capturedAzureConfig?.apiVersion).toBe('2025-01-01-preview')
    })

    it('botContext takes priority over LLM_* fallbacks', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          { AZURE_OPENAI_API_BASE: 'https://platform.openai.azure.com/' },
          { AZURE_OPENAI_API_KEY: 'platform-key' }
        ),
      })

      expect(capturedAzureConfig?.apiKey).toBe('platform-key')
      expect(capturedAzureConfig?.baseURL).toBe(
        'https://platform.openai.azure.com/openai/'
      )
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
        botContext: makeBotContext(
          {},
          { AZURE_OPENAI_API_KEY: 'platform-openai-key' }
        ),
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

    it('returns undefined when provider is litellm (via botContext.settings)', () => {
      mockConstants.LLM_PROVIDER = 'azure'

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext({
          LITELLM_API_URL: 'https://litellm.example.com',
        }),
      })

      expect(config.getApiVersion()).toBeUndefined()
    })

    it('returns undefined when provider is litellm (via LLM_PROVIDER=litellm)', () => {
      mockConstants.LLM_PROVIDER = 'litellm'

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      expect(config.getApiVersion()).toBeUndefined()
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

  describe('getProviderName', () => {
    it('returns litellm when botContext.settings.LITELLM_API_URL is set', () => {
      mockConstants.LLM_PROVIDER = 'azure'
      mockConstants.LLM_API_URL = ''

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext({
          LITELLM_API_URL: 'https://litellm.example.com',
        }),
      })

      expect(config.getProviderName()).toBe('litellm')
    })

    it('returns litellm when LLM_PROVIDER=litellm', () => {
      mockConstants.LLM_PROVIDER = 'litellm'

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      expect(config.getProviderName()).toBe('litellm')
    })

    it('returns azure when LITELLM_API_URL is not set and LLM_PROVIDER is azure', () => {
      mockConstants.LLM_PROVIDER = 'azure'

      const config = new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      expect(config.getProviderName()).toBe('azure')
    })
  })

  describe('LiteLLM client configuration', () => {
    beforeEach(() => {
      mockConstants.LLM_PROVIDER = 'azure'
      mockConstants.LLM_API_URL = ''
    })

    afterEach(() => {
      mockConstants.LLM_API_URL = ''
    })

    it('uses LiteLLM client when LITELLM_API_URL is set in botContext', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          { LITELLM_API_URL: 'https://litellm.example.com' },
          { LITELLM_API_KEY: 'platform-litellm-key' }
        ),
      })

      expect(capturedOpenAIConfig?.baseURL).toBe('https://litellm.example.com')
      expect(capturedOpenAIConfig?.apiKey).toBe('platform-litellm-key')
      expect(capturedAzureConfig).toBeNull()
    })

    it('falls back to LLM_API_KEY when LITELLM_API_KEY is empty', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          { LITELLM_API_URL: 'https://litellm.example.com' },
          { LITELLM_API_KEY: '' }
        ),
      })

      expect(capturedOpenAIConfig?.apiKey).toBe('fallback-key')
    })

    it('uses LLM_API_URL as litellm URL when LLM_PROVIDER=litellm and no botContext URL', () => {
      mockConstants.LLM_PROVIDER = 'litellm'
      mockConstants.LLM_API_URL = 'https://litellm-local.example.com'

      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gemini-pro',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(),
      })

      expect(capturedOpenAIConfig?.baseURL).toBe(
        'https://litellm-local.example.com'
      )

      mockConstants.LLM_PROVIDER = 'azure'
      mockConstants.LLM_API_URL = ''
    })

    it('sets x-litellm-tags header with both bot_id and org_id', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          { LITELLM_API_URL: 'https://litellm.example.com' },
          {},
          { botId: 'my-bot', organizationId: 'my-org' }
        ),
      })

      expect(capturedOpenAIConfig?.defaultHeaders).toEqual({
        'x-litellm-tags': 'bot_id:my-bot,org_id:my-org',
      })
    })

    it('sets x-litellm-tags header with only bot_id when org_id is missing', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          { LITELLM_API_URL: 'https://litellm.example.com' },
          {},
          { botId: 'my-bot', organizationId: '' }
        ),
      })

      expect(capturedOpenAIConfig?.defaultHeaders).toEqual({
        'x-litellm-tags': 'bot_id:my-bot',
      })
    })

    it('sets x-litellm-tags header with only org_id when bot_id is missing', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          { LITELLM_API_URL: 'https://litellm.example.com' },
          {},
          { botId: '', organizationId: 'my-org' }
        ),
      })

      expect(capturedOpenAIConfig?.defaultHeaders).toEqual({
        'x-litellm-tags': 'org_id:my-org',
      })
    })

    it('omits x-litellm-tags header when both bot_id and org_id are missing', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'claude-3-5-sonnet',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          { LITELLM_API_URL: 'https://litellm.example.com' },
          {},
          { botId: '', organizationId: '' }
        ),
      })

      expect(capturedOpenAIConfig?.defaultHeaders).toBeUndefined()
    })

    it('Azure client has no defaultHeaders even when botId and orgId are present', () => {
      new LLMConfig({
        maxRetries: DEFAULT_MAX_RETRIES,
        timeout: DEFAULT_TIMEOUT,
        modelName: 'gpt-4.1-mini',
        verbosity: VerbosityLevel.Medium,
        botContext: makeBotContext(
          { AZURE_OPENAI_API_BASE: 'https://platform.openai.azure.com/' },
          { AZURE_OPENAI_API_KEY: 'platform-key' },
          { botId: 'my-bot', organizationId: 'my-org' }
        ),
      })

      expect(capturedAzureConfig?.defaultHeaders).toBeUndefined()
      expect(capturedOpenAIConfig).toBeNull()
    })
  })
})
