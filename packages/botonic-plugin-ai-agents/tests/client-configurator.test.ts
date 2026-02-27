import { ModelName } from '@botonic/core'
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'

// Default config values matching constants
const DEFAULT_MAX_RETRIES = 2
const DEFAULT_TIMEOUT = 16000

// Store captured client configurations
let capturedOpenAIConfig: any = null
let capturedAzureConfig: any = null
let setDefaultOpenAIClientCalled = false
let setOpenAIAPICalled = false
let setTracingDisabledCalled = false

// Mock the @openai/agents module
jest.mock('@openai/agents', () => ({
  setDefaultOpenAIClient: jest.fn(_client => {
    setDefaultOpenAIClientCalled = true
  }),
  setOpenAIAPI: jest.fn(_api => {
    setOpenAIAPICalled = true
  }),
  setTracingDisabled: jest.fn(_disabled => {
    setTracingDisabledCalled = true
  }),
}))

// Mock the openai module
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(config => {
    capturedOpenAIConfig = config
    return { type: 'openai' }
  }),
  AzureOpenAI: jest.fn().mockImplementation(config => {
    capturedAzureConfig = config
    return { type: 'azure' }
  }),
}))

// We need to import after mocking
describe('OpenAI Client Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    capturedOpenAIConfig = null
    capturedAzureConfig = null
    setDefaultOpenAIClientCalled = false
    setOpenAIAPICalled = false
    setTracingDisabledCalled = false
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('OpenAiClientConfigurator.setUp', () => {
    it('should call setOpenAIAPI with chat_completions', async () => {
      process.env.OPENAI_PROVIDER = 'azure'
      process.env.AZURE_OPENAI_API_KEY = 'test-azure-key'
      process.env.AZURE_OPENAI_API_BASE = 'https://test.openai.azure.com'

      // Re-import to get fresh module with new env
      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )

      new OpenAiClientConfigurator(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        ModelName.Gpt41Mini
      ).setUp()

      const { setOpenAIAPI } = await import('@openai/agents')
      expect(setOpenAIAPI).toHaveBeenCalledWith('chat_completions')
    })

    it('should call setTracingDisabled with true', async () => {
      process.env.OPENAI_PROVIDER = 'azure'
      process.env.AZURE_OPENAI_API_KEY = 'test-azure-key'
      process.env.AZURE_OPENAI_API_BASE = 'https://test.openai.azure.com'

      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )

      new OpenAiClientConfigurator(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        ModelName.Gpt41Mini
      ).setUp()

      const { setTracingDisabled } = await import('@openai/agents')
      expect(setTracingDisabled).toHaveBeenCalledWith(true)
    })

    it('should use Azure client when OPENAI_PROVIDER is azure', async () => {
      process.env.OPENAI_PROVIDER = 'azure'
      process.env.AZURE_OPENAI_API_KEY = 'test-azure-key'
      process.env.AZURE_OPENAI_API_BASE = 'https://test.openai.azure.com'
      process.env.AZURE_OPENAI_API_VERSION = '2025-01-01-preview'
      process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME = 'my-deployment'

      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )
      const { AzureOpenAI } = await import('openai')

      new OpenAiClientConfigurator(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        ModelName.Gpt41Mini
      ).setUp()

      expect(AzureOpenAI).toHaveBeenCalled()
    })

    it('should use OpenAI client when OPENAI_PROVIDER is openai', async () => {
      process.env.OPENAI_PROVIDER = 'openai'
      process.env.OPENAI_API_KEY = 'test-openai-key'

      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )
      const OpenAI = (await import('openai')).default

      new OpenAiClientConfigurator(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        ModelName.Gpt41Mini
      ).setUp()

      expect(OpenAI).toHaveBeenCalled()
    })
  })

  describe('Client configuration parameters', () => {
    it('should use default timeout of 16000ms when not specified', async () => {
      process.env.OPENAI_PROVIDER = 'openai'
      process.env.OPENAI_API_KEY = 'test-key'

      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )

      new OpenAiClientConfigurator(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        ModelName.Gpt41Mini
      ).setUp()

      expect(capturedOpenAIConfig).toBeDefined()
      expect(capturedOpenAIConfig.timeout).toBe(16000)
    })

    it('should use custom timeout when specified', async () => {
      process.env.OPENAI_PROVIDER = 'openai'
      process.env.OPENAI_API_KEY = 'test-key'

      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )

      new OpenAiClientConfigurator(2, 30000, ModelName.Gpt41Mini).setUp()

      expect(capturedOpenAIConfig).toBeDefined()
      expect(capturedOpenAIConfig.timeout).toBe(30000)
    })

    it('should use default maxRetries of 2 when not specified', async () => {
      process.env.OPENAI_PROVIDER = 'openai'
      process.env.OPENAI_API_KEY = 'test-key'

      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )

      new OpenAiClientConfigurator(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        ModelName.Gpt41Mini
      ).setUp()

      expect(capturedOpenAIConfig).toBeDefined()
      expect(capturedOpenAIConfig.maxRetries).toBe(2)
    })

    it('should use custom maxRetries when specified', async () => {
      process.env.OPENAI_PROVIDER = 'openai'
      process.env.OPENAI_API_KEY = 'test-key'

      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )

      new OpenAiClientConfigurator(5, 16000, ModelName.Gpt41Mini).setUp()

      expect(capturedOpenAIConfig).toBeDefined()
      expect(capturedOpenAIConfig.maxRetries).toBe(5)
    })

    it('should pass API key to OpenAI client', async () => {
      process.env.OPENAI_PROVIDER = 'openai'
      process.env.OPENAI_API_KEY = 'sk-test-api-key'

      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )

      new OpenAiClientConfigurator(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        ModelName.Gpt41Mini
      ).setUp()

      expect(capturedOpenAIConfig).toBeDefined()
      expect(capturedOpenAIConfig.apiKey).toBe('sk-test-api-key')
    })
  })

  describe('Azure specific configuration', () => {
    it('should pass all Azure-specific parameters', async () => {
      process.env.OPENAI_PROVIDER = 'azure'
      process.env.AZURE_OPENAI_API_KEY = 'azure-api-key'
      process.env.AZURE_OPENAI_API_BASE = 'https://myinstance.openai.azure.com'
      process.env.AZURE_OPENAI_API_VERSION = '2025-01-01-preview'
      process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME = 'gpt-4-deployment'

      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )

      new OpenAiClientConfigurator(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        ModelName.Gpt41Mini
      ).setUp()

      expect(capturedAzureConfig).toBeDefined()
      expect(capturedAzureConfig.apiKey).toBe('azure-api-key')
      expect(capturedAzureConfig.baseURL).toBe(
        'https://myinstance.openai.azure.com'
      )
      expect(capturedAzureConfig.apiVersion).toBe('2025-01-01-preview')
      // Deployment name is derived from model (Gpt41Mini -> gpt-41-mini_p1)
      expect(capturedAzureConfig.deployment).toBe('gpt-41-mini_p1')
    })
  })

  describe('Provider selection based on environment', () => {
    it('should default to azure when OPENAI_PROVIDER is not set', async () => {
      delete process.env.OPENAI_PROVIDER
      process.env.AZURE_OPENAI_API_KEY = 'azure-key'
      process.env.AZURE_OPENAI_API_BASE = 'https://test.openai.azure.com'

      jest.resetModules()
      const { OpenAiClientConfigurator } = await import(
        '../src/client-configurator'
      )
      const { AzureOpenAI } = await import('openai')

      new OpenAiClientConfigurator(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        ModelName.Gpt41Mini
      ).setUp()

      // Default should be azure
      expect(AzureOpenAI).toHaveBeenCalled()
    })
  })
})
