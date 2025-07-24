export enum ENVIRONMENT {
  PRODUCTION = 'production',
  LOCAL = 'local',
}
export enum NODE_ENV {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

const isExpectedEnvironment = (
  env: ENVIRONMENT,
  expected: ENVIRONMENT
): boolean => env === expected

export function isNodeDev(): boolean {
  return process.env.NODE_ENV === NODE_ENV.DEVELOPMENT
}

export function isNodeProd(): boolean {
  return process.env.NODE_ENV === NODE_ENV.PRODUCTION
}

export function isNodeTest(): boolean {
  return process.env.NODE_ENV === NODE_ENV.TEST
}

export const getEnvironment = (): ENVIRONMENT => {
  return process.env.ENVIRONMENT as ENVIRONMENT
}

export const isLocal = (env?: ENVIRONMENT): boolean =>
  isExpectedEnvironment(env || getEnvironment(), ENVIRONMENT.LOCAL)

export const isProduction = (env?: ENVIRONMENT): boolean =>
  isExpectedEnvironment(env || getEnvironment(), ENVIRONMENT.PRODUCTION)

export function isBrowser() {
  return typeof window !== 'undefined'
}
