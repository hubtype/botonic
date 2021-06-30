import { execSync } from 'child_process'
import { readdirSync, statSync } from 'fs'
import { homedir, platform } from 'os'
import { clean } from 'semver'

export function execCommand(command: string): string {
  return String(execSync(command)).trim()
}

export function isWindows(): boolean {
  return platform() === 'win32'
}

export function getHomeDirectory(): string {
  return isWindows() ? homedir() : execCommand('eval echo ~${SUDO_USER}')
}

export function crawlDirectory(dir: string, f: (_: string) => void): void {
  const files = readdirSync(dir)
  for (const file of files) {
    const filePath = `${dir}/${file}`
    const stat = statSync(filePath)
    if (stat.isDirectory()) crawlDirectory(filePath, f)
    if (stat.isFile()) f(filePath)
  }
}

export function getCleanVersionForPackage(packageName: string): string | null {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require(`${packageName}/package.json`) // TODO: Test that works on Windows
  return clean(version)
}
