import {
  type BotContext,
  type BotRequest,
  type BotSecrets,
  type BotSettings,
  type ContactInfo,
  INPUT,
  type Input,
  PROVIDER,
  type ProviderType,
  type ResolvedPlugins,
  type Session,
  type SessionUser,
} from '../models'

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

export const TEST_DEFAULTS = {
  HUBTYPE_API_URL: 'https://api.hubtype.com',
  STATIC_URL: 'https://static.hubtype.com',
  LITELLM_API_URL: 'https://api.litellm.com',
  AZURE_OPENAI_API_BASE: 'https://api.openai.com',
  AZURE_OPENAI_API_VERSION: '2026-02-01',
  LANGUAGE_DETECTION_ENABLED: 'true',
  HUBTYPE_ACCESS_TOKEN: 'testAccessToken',
  LITELLM_API_KEY: 'testLiteLLMAPIKey',
  AZURE_OPENAI_API_KEY: 'testAzureOpenAIAPIKey',
  ACCESS_TOKEN: 'fake_access_token',
  HUBTYPE_API_HOST: 'https://api.hubtype.com',
  FLOW_THREAD_ID: 'testFlowThreadId',
  BOT_ID: 'testBotId',
  USER_ID: 'testUserId',
  ORG_ID: 'testOrgId',
  ORG_NAME: 'testOrg',
  PROVIDER: PROVIDER.WEBCHAT as ProviderType,
  LOCALE: 'en',
  COUNTRY: 'US',
  BOT_INTERACTION_ID: 'testInteractionId',
  MESSAGE_ID: 'testMessageId',
  LAST_ROUTE_PATH: '',
}

// ---------------------------------------------------------------------------
// Leaf factories
// ---------------------------------------------------------------------------

export function createTestSettings(
  overrides?: Partial<BotSettings>
): BotSettings {
  return {
    HUBTYPE_API_URL: TEST_DEFAULTS.HUBTYPE_API_URL,
    STATIC_URL: TEST_DEFAULTS.STATIC_URL,
    LITELLM_API_URL: TEST_DEFAULTS.LITELLM_API_URL,
    AZURE_OPENAI_API_BASE: TEST_DEFAULTS.AZURE_OPENAI_API_BASE,
    AZURE_OPENAI_API_VERSION: TEST_DEFAULTS.AZURE_OPENAI_API_VERSION,
    LANGUAGE_DETECTION_ENABLED: TEST_DEFAULTS.LANGUAGE_DETECTION_ENABLED,
    CUSTOM_SHORT_URL_HOST: null,
    custom: {},
    ...overrides,
  }
}

export function createTestSecrets(overrides?: Partial<BotSecrets>): BotSecrets {
  return {
    HUBTYPE_ACCESS_TOKEN: TEST_DEFAULTS.HUBTYPE_ACCESS_TOKEN,
    LITELLM_API_KEY: TEST_DEFAULTS.LITELLM_API_KEY,
    AZURE_OPENAI_API_KEY: TEST_DEFAULTS.AZURE_OPENAI_API_KEY,
    custom: {},
    ...overrides,
  }
}

export interface TestUserOptions {
  id?: string
  provider?: ProviderType
  locale?: string
  country?: string
  systemLocale?: string
  contactInfo?: ContactInfo[]
  extraData?: Record<string, any>
}

export function createTestSessionUser(
  options?: TestUserOptions
): SessionUser<Record<string, any>> {
  const locale = options?.locale ?? TEST_DEFAULTS.LOCALE
  const country = options?.country ?? TEST_DEFAULTS.COUNTRY
  return {
    id: options?.id ?? TEST_DEFAULTS.USER_ID,
    provider: options?.provider ?? TEST_DEFAULTS.PROVIDER,
    locale,
    country,
    system_locale: options?.systemLocale ?? locale,
    contact_info: options?.contactInfo ?? [],
    extra_data: options?.extraData ?? {},
  }
}

export interface TestSessionOptions {
  user?: TestUserOptions
  botId?: string
  organization?: string
  organizationId?: string
  isFirstInteraction?: boolean
  isTestIntegration?: boolean
  accessToken?: string
  hubtypeApi?: string
  flowThreadId?: string
  retries?: number
  shadowing?: boolean
  hubtypeCaseId?: string
  captureUserInputNodeId?: string
}

export function createTestSession(
  options?: TestSessionOptions
): Session<Record<string, any>> {
  return {
    bot: { id: options?.botId ?? TEST_DEFAULTS.BOT_ID },
    user: createTestSessionUser(options?.user),
    organization: options?.organization ?? TEST_DEFAULTS.ORG_NAME,
    organization_id: options?.organizationId ?? TEST_DEFAULTS.ORG_ID,
    is_first_interaction: options?.isFirstInteraction ?? false,
    is_test_integration: options?.isTestIntegration ?? false,
    _access_token: options?.accessToken ?? TEST_DEFAULTS.ACCESS_TOKEN,
    _hubtype_api: options?.hubtypeApi ?? TEST_DEFAULTS.HUBTYPE_API_HOST,
    flow_thread_id: options?.flowThreadId ?? TEST_DEFAULTS.FLOW_THREAD_ID,
    __retries: options?.retries ?? 0,
    _shadowing: options?.shadowing,
    _hubtype_case_id: options?.hubtypeCaseId,
    capture_user_input: options?.captureUserInputNodeId
      ? { node_id: options.captureUserInputNodeId }
      : undefined,
  }
}

export interface TestInputOptions {
  type?: Input['type']
  data?: string
  text?: string
  payload?: string
  src?: string
  botInteractionId?: string
  messageId?: string
  context?: Input['context']
  transcript?: string
}

export function createTestInput(options?: TestInputOptions): Input {
  return {
    type: options?.type ?? INPUT.TEXT,
    data: options?.data,
    text: options?.text,
    payload: options?.payload,
    src: options?.src,
    transcript: options?.transcript,
    context: options?.context,
    bot_interaction_id:
      options?.botInteractionId ?? TEST_DEFAULTS.BOT_INTERACTION_ID,
    message_id: options?.messageId ?? TEST_DEFAULTS.MESSAGE_ID,
  }
}

// ---------------------------------------------------------------------------
// Composite factories
// ---------------------------------------------------------------------------

export interface TestBotRequestOptions {
  input?: TestInputOptions | Input
  session?: TestSessionOptions | Session
  lastRoutePath?: string
  settings?: Partial<BotSettings> | BotSettings
  secrets?: Partial<BotSecrets> | BotSecrets
}

function isFullInput(v: TestInputOptions | Input): v is Input {
  return 'bot_interaction_id' in v && 'message_id' in v
}

function isFullSession(v: TestSessionOptions | Session): v is Session {
  return 'bot' in v && '__retries' in v
}

function isFullSettings(
  v: Partial<BotSettings> | BotSettings
): v is BotSettings {
  return (
    'HUBTYPE_API_URL' in v &&
    'STATIC_URL' in v &&
    'LITELLM_API_URL' in v &&
    'AZURE_OPENAI_API_BASE' in v &&
    'AZURE_OPENAI_API_VERSION' in v &&
    'LANGUAGE_DETECTION_ENABLED' in v &&
    'CUSTOM_SHORT_URL_HOST' in v &&
    'custom' in v
  )
}

function isFullSecrets(
  v: Partial<BotSecrets> | BotSecrets
): v is BotSecrets {
  return (
    'HUBTYPE_ACCESS_TOKEN' in v &&
    'LITELLM_API_KEY' in v &&
    'AZURE_OPENAI_API_KEY' in v &&
    'custom' in v
  )
}

export function createTestBotRequest(
  options?: TestBotRequestOptions
): BotRequest {
  const input =
    options?.input == null
      ? createTestInput()
      : isFullInput(options.input)
        ? options.input
        : createTestInput(options.input)

  const session =
    options?.session == null
      ? createTestSession()
      : isFullSession(options.session)
        ? options.session
        : createTestSession(options.session)

  const settings =
    options?.settings == null
      ? createTestSettings()
      : isFullSettings(options.settings)
        ? options.settings
        : createTestSettings(options.settings)

  const secrets =
    options?.secrets == null
      ? createTestSecrets()
      : isFullSecrets(options.secrets)
        ? options.secrets
        : createTestSecrets(options.secrets)

  return {
    input,
    session,
    lastRoutePath: options?.lastRoutePath ?? TEST_DEFAULTS.LAST_ROUTE_PATH,
    settings,
    secrets,
  }
}

export interface TestBotContextOptions<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
> extends TestBotRequestOptions {
  plugins?: TPlugins
  params?: Record<string, string>
  defaultDelay?: number
  defaultTyping?: number
}

export function createTestBotContext<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
>(
  options?: TestBotContextOptions<TPlugins>
): BotContext<TPlugins> {
  const request = createTestBotRequest(options)

  const sessionForLocale =
    options?.session == null
      ? createTestSession()
      : isFullSession(options.session)
        ? options.session
        : createTestSession(options.session)

  const locale = sessionForLocale.user.locale
  const country = sessionForLocale.user.country
  const systemLocale = sessionForLocale.user.system_locale

  return {
    ...request,
    plugins: options?.plugins ?? ({} as TPlugins),
    params: options?.params ?? {},
    defaultDelay: options?.defaultDelay ?? 0,
    defaultTyping: options?.defaultTyping ?? 0,
    getUserLocale: () => locale,
    getUserCountry: () => country,
    getSystemLocale: () => systemLocale,
    setUserLocale: () => undefined,
    setUserCountry: () => undefined,
    setSystemLocale: () => undefined,
  }
}

/**
 * Alias for `createTestBotContext` typed as `PluginPreRequest`.
 * PluginPreRequest === BotContext in @botonic/core.
 */
export const createTestPluginPreRequest = createTestBotContext

export interface TestPluginPostRequestOptions<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
> extends TestBotContextOptions<TPlugins> {
  response?: string | null
}

export function createTestPluginPostRequest<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
>(
  options?: TestPluginPostRequestOptions<TPlugins>
): BotContext<TPlugins> & { response: string | null } {
  return {
    ...createTestBotContext(options),
    response: options?.response ?? null,
  }
}
