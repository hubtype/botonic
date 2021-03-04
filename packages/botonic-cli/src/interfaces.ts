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
  provider_accounts: string[]
  is_debug: boolean
  is_published: boolean
  active_users: string
}

export interface BotCredentials {
  bot: BotInfo | null
}

export interface AnalyticsService {
  track: (any) => any
}
