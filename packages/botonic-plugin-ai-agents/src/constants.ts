export const HUBTYPE_API_URL =
  process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

// LLM Configuration (provider-agnostic; set LLM_PROVIDER=azure|openai)
export const LLM_PROVIDER: 'openai' | 'azure' =
  (process.env.LLM_PROVIDER as 'openai' | 'azure') || 'azure'
export const LLM_API_KEY = process.env.LLM_API_KEY // pragma: allowlist secret
export const LLM_API_URL = process.env.LLM_API_URL
export const LLM_AZURE_API_VERSION =
  process.env.LLM_AZURE_API_VERSION || '2025-01-01-preview'
export const LLM_OPENAI_MODEL = process.env.LLM_OPENAI_MODEL || 'gpt-4.1-mini'

export const isProd = process.env.NODE_ENV === 'production'

export const MAX_MEMORY_LENGTH = 25

export const DEFAULT_TIMEOUT_16_SECONDS = 16000
export const DEFAULT_MAX_RETRIES = 2
