export const HUBTYPE_API_URL =
  process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

// OpenAI Provider Configuration
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY // pragma: allowlist secret
export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
export const OPENAI_PROVIDER: 'openai' | 'azure' =
  (process.env.OPENAI_PROVIDER as 'openai' | 'azure') || 'azure'

// Azure OpenAI Configuration
export const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY // pragma: allowlist secret
export const AZURE_OPENAI_API_BASE = process.env.AZURE_OPENAI_API_BASE
export const AZURE_OPENAI_API_DEPLOYMENT_NAME =
  process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME || 'gpt-41-mini_p1'
export const AZURE_OPENAI_API_VERSION =
  process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview'

export const isProd = process.env.NODE_ENV === 'production'

export const MAX_MEMORY_LENGTH = 25

export const DEFAULT_TIMEOUT_16_SECONDS = 16000
export const DEFAULT_MAX_RETRIES = 2
