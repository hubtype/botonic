export const HUBTYPE_API_URL =
  process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

export const AZURE_OPENAI_API_BASE = process.env.AZURE_OPENAI_API_BASE
export const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY // pragma: allowlist secret

export const isProd = process.env.NODE_ENV === 'production'

export const MAX_MEMORY_LENGTH = 25
