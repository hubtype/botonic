import { VerbosityLevel } from '@botonic/core'
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'

import { LLMConfig } from '../src/llm-config'

const DEFAULT_MAX_RETRIES = 2
const DEFAULT_TIMEOUT = 16000

let capturedOpenAIConfig: Record<string, unknown> | null = null
let capturedAzureConfig: Record<string, unknown> | null = null

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
  OpenAIProvider: jest.fn().mockImplementation(() => ({ type: 'provider' })),
}))

// var so the variable is hoisted and assignable when the mock factory runs (Jest hoists mocks)
// eslint-disable-next-line no-var
var mockConstants: {
  OPENAI_PROVIDER: 'openai' | 'azure'
  OPENAI_MODEL: string
  OPENAI_API_KEY: string
  AZURE_OPENAI_API_KEY: string
  AZURE_OPENAI_API_BASE: string
  AZURE_OPENAI_API_VERSION: string
  isProd: boolean
}
jest.mock('../src/constants', () => {
  mockConstants = {
    OPENAI_PROVIDER: 'azure',
    OPENAI_MODEL: 'gpt-4.1-mini',
    OPENAI_API_KEY: 'test-openai-key',
    AZURE_OPENAI_API_KEY: 'test-azure-key',
    AZURE_OPENAI_API_BASE: 'https://test.openai.azure.com',
    AZURE_OPENAI_API_VERSION: '2025-01-01-preview',
    isProd: false,
  }
  return mockConstants
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

  describe('modelName', () => {
    it('should use OPENAI_MODEL when provider is openai', () => {
      mockConstants.OPENAI_PROVIDER = 'openai'

      const config = new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        VerbosityLevel.Medium
      )

      expect(config.modelName).toBe('gpt-4.1-mini')
    })

    it('should use passed modelName when provider is azure', () => {
      mockConstants.OPENAI_PROVIDER = 'azure'

      const config = new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini', // Azure deployment names typically include model family
        VerbosityLevel.Medium
      )

      expect(config.modelName).toBe('gpt-4.1-mini')
    })
  })

  describe('modelSettings', () => {
    beforeEach(() => {
      mockConstants.OPENAI_PROVIDER = 'azure'
    })

    it('should return gpt-4 style settings for gpt-4 model', () => {
      const config = new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        VerbosityLevel.Medium
      )

      expect(config.modelSettings).toEqual({
        temperature: 0,
        text: { verbosity: 'medium' },
      })
    })

    it('should return gpt-5 style settings for gpt-5 model', () => {
      const config = new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-5-mini',
        VerbosityLevel.High
      )

      expect(config.modelSettings).toEqual({
        reasoning: { effort: 'none' },
        temperature: 1,
        text: { verbosity: 'high' },
      })
    })

    it('should throw for unsupported model', () => {
      expect(
        () =>
          new LLMConfig(
            DEFAULT_MAX_RETRIES,
            DEFAULT_TIMEOUT,
            'unknown-model',
            VerbosityLevel.Medium
          )
      ).toThrow('Unsupported model: unknown-model')
    })
  })

  describe('client configuration', () => {
    it('should create OpenAI client with timeout and maxRetries when provider is openai', () => {
      mockConstants.OPENAI_PROVIDER = 'openai'

      new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini',
        VerbosityLevel.Medium
      )

      expect(capturedOpenAIConfig).toBeDefined()
      expect(capturedOpenAIConfig?.timeout).toBe(16000)
      expect(capturedOpenAIConfig?.maxRetries).toBe(2)
    })

    it('should use custom timeout and maxRetries', () => {
      mockConstants.OPENAI_PROVIDER = 'openai'

      new LLMConfig(5, 30000, 'gpt-4.1-mini', VerbosityLevel.Medium)

      expect(capturedOpenAIConfig?.timeout).toBe(30000)
      expect(capturedOpenAIConfig?.maxRetries).toBe(5)
    })

    it('should create Azure client with deployment when provider is azure', () => {
      mockConstants.OPENAI_PROVIDER = 'azure'

      new LLMConfig(
        DEFAULT_MAX_RETRIES,
        DEFAULT_TIMEOUT,
        'gpt-4.1-mini', // deployment name
        VerbosityLevel.Medium
      )

      expect(capturedAzureConfig).toBeDefined()
      expect(capturedAzureConfig?.deployment).toBe('gpt-4.1-mini')
      expect(capturedAzureConfig?.baseURL).toBe('https://test.openai.azure.com')
      expect(capturedAzureConfig?.apiVersion).toBe('2025-01-01-preview')
    })
  })
})
