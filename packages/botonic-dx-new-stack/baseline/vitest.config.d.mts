import type { UserConfig } from 'vitest/config'

export declare function packageTests(
  packageUrl: string,
  options?: { react?: boolean; botApp?: boolean }
): UserConfig
