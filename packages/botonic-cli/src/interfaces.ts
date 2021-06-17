export interface BotonicProject {
  name: string
  description: string
  uri: string
}

export interface CredentialsHandlerArgs {
  homePath: string
  filename: string
}

interface OAuth {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
  refresh_token: string
}

interface Me {
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

interface AnalyticsInfo {
  anonymous_id: string
}

export interface GlobalCredentials {
  oauth?: OAuth
  me?: Me
  analytics: AnalyticsInfo
}

interface BotLastUpdate {
  version: string
  created_at: string
  modified_at: string
  published_at: string
  comment: string
}
interface BotInfo {
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
  bot: BotInfo | null
}

export interface AnalyticsService {
  track: (_: {
    event: string
    anonymousId: string | number|undefined
    properties: any
  }) => any
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
