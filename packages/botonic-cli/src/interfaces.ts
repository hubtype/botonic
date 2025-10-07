export interface BotonicProject {
  name: string
  description: string
  version: string
  localTestPath: string
}

export interface CredentialsHandlerArgs {
  homeDir: string
  filename: string // only filename, it does not contain the path to folder
}

export interface OAuth {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
  refresh_token: string
}

export interface Me {
  id: string
  email: string
  first_name: string
  last_name: string
  organization_id: string
  campaign: string
}
export interface GlobalCredentials {
  oauth?: OAuth
  me?: Me
}
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface BotListItem {
  id: string
  name: string
}

interface BotLastUpdate {
  version: string
  created_at: string
  modified_at: string
  published_at: string
  comment: string
}

export interface BotDetail {
  id: string
  name: string
  organization: string
  last_update: BotLastUpdate
  created_at: string
  provider_accounts: ProviderAccountsInfo[]
  is_debug: boolean
  is_published: boolean
  active_users: number
}

interface ProviderAccountsInfo {
  id: string
  queue_id: string
  bot_id: string
  provider: string
  name: string
  username: string
  credentials: string
  credentials_json: {
    name: string
    bot_id: string
    settings: {
      visible: boolean
      whitelisted_urls: string[]
      scheduled_queue_id: string
    }
  }
  netlify_url: string
  is_playground: boolean
  created_by_id: string
  chat_count: number
  is_active: boolean
  imp_id: string
}

export interface BotCredentials {
  bot: BotDetail | null
}

export interface SystemInformation {
  platform: string
  arch: string
  timezone: string
  timestamp: string
  is_tty: boolean
  framework_path: string
  system_path: string
  node_version: string
  botonic_cli_version: string
  botonic_dependencies: any[] | string
}

export type JSONPrimitive = string | number | boolean | null
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONObject = { [member: string]: JSONValue }
export type JSONArray = JSONValue[]

export interface DeployHubtypeFlags {
  command?: string
  botName?: string
  email?: string
  password?: string
}

export interface LoginErrorData {
  error_description?: string
}
