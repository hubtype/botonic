export const FLOW_BUILDER_API_URL_PROD =
  process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'
export const SEPARATOR = '|'
export const SOURCE_INFO_SEPARATOR = `${SEPARATOR}source_`
export const VARIABLE_PATTERN = /{([^}]+)}/g
export const ACCESS_TOKEN_VARIABLE_KEY = '_access_token'
export const REG_EXP_PATTERN = /^\/(.*)\/([gimyus]*)$/
export const UUID_REGEXP =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/* ********** PAYLOADS ********** */
export const AGENT_RATING_PAYLOAD = 'agent-rating'

/* ********** FLOW NAMES ********** */
export const MAIN_FLOW_NAME = 'Main'
export const KNOWLEDGE_BASE_FLOW_NAME = 'Knowledge base'
export const AI_AGENTS_FLOW_NAME = 'AI Agents'
export const FALLBACK_FLOW_NAME = 'Fallback'
