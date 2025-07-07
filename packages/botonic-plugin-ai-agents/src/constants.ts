export const HUBTYPE_API_URL =
  process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY // pragma: allowlist secret
export const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY // pragma: allowlist secret
export const AZURE_OPENAI_API_BASE = process.env.AZURE_OPENAI_API_BASE
export const AZURE_OPENAI_API_DEPLOYMENT_NAME =
  process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME || 'gpt-4o-mini_p1'
export const AZURE_OPENAI_API_VERSION =
  process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview'
