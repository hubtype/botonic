import { isProduction } from './env-utils'

export function log(...args: unknown[]): void {
  if (!isProduction()) {
    console.log(...args)
  }
}
