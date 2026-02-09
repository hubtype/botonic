import { arch, platform } from 'node:os'
import { join } from 'node:path'

import { BOTONIC_NPM_NAMESPACE } from '../constants.js'
import type { SystemInformation } from '../interfaces.js'
import { readJSON } from './file-system.js'
import { execCommandSafe } from './system.js'

export function isWindows(): boolean {
  return platform() === 'win32'
}

export function getBotonicCLIVersion(): string {
  try {
    return (readJSON(join(__dirname, '..', '..', 'package.json')) as any)
      .version
  } catch (e) {
    return String(e)
  }
}

export function getBotonicDependencies(): any[] | string {
  try {
    const packageJSON = readJSON('package.json')
    if (!packageJSON) {
      return 'No package.json found.'
    }
    const botonicDependencies = Object.entries(
      packageJSON.dependencies as any
    ).filter(([k, _]) => k.includes(BOTONIC_NPM_NAMESPACE))
    return botonicDependencies
  } catch (e) {
    return String(e)
  }
}

export function getSystemInformation(): SystemInformation {
  return {
    platform: platform(),
    arch: arch(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
    is_tty: Boolean(process.stdout.isTTY),
    framework_path: join(__dirname, '..'),
    system_path: isWindows()
      ? execCommandSafe('echo %PATH%')
      : execCommandSafe('echo $PATH'),
    node_version: execCommandSafe('node --version'),
    botonic_cli_version: getBotonicCLIVersion(),
    botonic_dependencies: getBotonicDependencies(),
  }
}
