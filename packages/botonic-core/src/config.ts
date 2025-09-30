export interface HubtypeEnvironmentConfig {
  hubtypeApiUrl: string
  webchatPusherKey: string
}

export type HubtypeConfigOverrides = Partial<HubtypeEnvironmentConfig>

const DEFAULT_CONFIG: HubtypeEnvironmentConfig = {
  hubtypeApiUrl: 'https://api.hubtype.com',
  webchatPusherKey: '434ca667c8e6cb3f641c', // pragma: allowlist secret
}

let overrides: HubtypeConfigOverrides = {}

function readEnvValue(key: string): string | undefined {
  if (typeof process === 'undefined' || !process?.env) {
    return undefined
  }
  const value = process.env[key]
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  return value
}

export function setHubtypeConfig(newConfig: HubtypeConfigOverrides): void {
  overrides = { ...overrides, ...newConfig }
}

export function resetHubtypeConfig(): void {
  overrides = {}
}

export function getHubtypeApiUrl(): string {
  return (
    overrides.hubtypeApiUrl ??
    readEnvValue('HUBTYPE_API_URL') ??
    DEFAULT_CONFIG.hubtypeApiUrl
  )
}

export function getWebchatPusherKey(): string {
  return (
    overrides.webchatPusherKey ??
    readEnvValue('WEBCHAT_PUSHER_KEY') ??
    DEFAULT_CONFIG.webchatPusherKey
  )
}

export function getHubtypeConfig(): HubtypeEnvironmentConfig {
  return {
    hubtypeApiUrl: getHubtypeApiUrl(),
    webchatPusherKey: getWebchatPusherKey(),
  }
}
