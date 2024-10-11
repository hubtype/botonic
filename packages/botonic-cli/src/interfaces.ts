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
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  pic: string
  queues: string[]
  projects: string[]
  must_change_password: boolean
  created_by_id: string
  status: string
  organization_id: string
  notifications_new_case: boolean
  notifications_new_message: boolean
  notifications_duration: number
  is_staff: boolean
  fb_info: string
  is_read_only: boolean
  preferred_product: string
  campaign: string
  managers_settings_json: any
}

export interface AnalyticsInfo {
  anonymous_id: string
}

export interface GlobalCredentials {
  oauth?: OAuth
  me?: Me
  analytics: AnalyticsInfo
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

export interface PlaygroundSessionInfo {
  id: string
  created_at: string
  code: string
  url: string
  anonymous_id: string
  app_name: string
  is_active: boolean
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

export interface TrackArgs {
  event: string
  anonymousId: string
  properties?: any
}
export interface AnalyticsService {
  track: (args: TrackArgs) => void
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
