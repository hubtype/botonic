export const HUBTYPE_API_URL =
  process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

// Azure OpenAI Configuration (used as local-dev fallback; production values come from BotSettings/BotSecrets)
export const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY // pragma: allowlist secret
export const AZURE_OPENAI_API_BASE = process.env.AZURE_OPENAI_API_BASE
export const AZURE_OPENAI_API_VERSION =
  process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview'

export const isProd = process.env.NODE_ENV === 'production'

export const MAX_MEMORY_LENGTH = 25

export const DEFAULT_TIMEOUT_16_SECONDS = 16000
export const DEFAULT_MAX_RETRIES = 2

export const LLM_PROVIDERS = {
  LITELLM: 'litellm',
  AZURE: 'azure',
} as const

export const LITELLM_TAG_KEYS = {
  BOT_ID: 'bot_id',
  ORG_ID: 'org_id',
  SEPARATOR: ',',
} as const
