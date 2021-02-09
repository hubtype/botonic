import Analytics from 'analytics-node'
import { exec, execSync, spawn } from 'child_process'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

export let analytics: Analytics

export let credentials: any
export const botonicHomePath: string = path.join(os.homedir(), '.botonic')
export const botonicCredentialsPath = path.join(
  botonicHomePath,
  'credentials.json'
)

export function readJSON(path: string): JSON {
  return JSON.parse(fs.readFileSync(path, 'utf8'))
}

export function writeJSON(path: string, object: any): void {
  fs.writeFileSync(path, JSON.stringify(object))
}

export function initializeCredentials(): void {
  if (!fs.existsSync(botonicHomePath)) fs.mkdirSync(botonicHomePath)
  const anonymousId = Math.round(Math.random() * 100000000)
  writeJSON(botonicCredentialsPath, {
    analytics: { anonymous_id: anonymousId },
  })
}

function readCredentials() {
  if (!fs.existsSync(botonicCredentialsPath)) {
    initializeCredentials()
  }
  try {
    credentials = readJSON(botonicCredentialsPath)
  } catch (e) {
    console.warn('Credentials could not be loaded', e)
  }
}

try {
  readCredentials()
} catch (e) {
  console.warn('Credentials could not be loaded', e)
}

function isAnalyticsEnabled(): boolean {
  return process.env.BOTONIC_DISABLE_ANALYTICS !== '1'
}

if (isAnalyticsEnabled()) {
  analytics = new Analytics('YD0jpJHNGW12uhLNbgB4wbdTRQ4Cy1Zu')
}

function isWindows() {
  return process.platform === 'win32'
}

function execCommand(command: string) {
  try {
    return String(execSync(command)).trim()
  } catch (e) {
    return String(e)
  }
}

function getBotonicDependencies(): any[] | string {
  try {
    const packageJSON = readJSON('package.json')
    const botonicDependencies = Object.entries(
      (packageJSON as any).dependencies
    ).filter(([k, _]) => k.includes('@botonic'))
    return botonicDependencies
  } catch (e) {
    return String(e)
  }
}

function getSystemInformation() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
    is_tty: process.stdout.isTTY,
    binary_path: isWindows()
      ? execCommand('where botonic')
      : execCommand('which botonic'),
    system_path: isWindows()
      ? execCommand('echo %PATH%')
      : execCommand('echo $PATH'),
    framework_path: isWindows() ? execCommand('cd') : execCommand('pwd'),
    node_version: execCommand('node --version'),
    botonic_cli_version: execCommand('botonic --version'),
    botonic_dependencies: getBotonicDependencies(),
  }
}
export function trackError(type: string, properties = {}): void {
  track('Error Botonic CLI', { ...properties, error_type: type })
}
export function track(event: string, properties = {}): void {
  if (
    isAnalyticsEnabled() &&
    analytics &&
    credentials &&
    credentials.analytics
  ) {
    properties = {
      ...properties,
      ...getSystemInformation(),
    }
    analytics.track({
      event: event,
      anonymousId: credentials.analytics.anonymous_id,
      properties: properties,
    })
  }
}

export function botonicPostInstall(): void {
  if (isAnalyticsEnabled()) {
    initializeCredentials()
    readCredentials()
    track('Installed Botonic CLI')
  }
}

export function sleep(ms: number): Promise<number> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function sh(cmd: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

export async function getGlobalNodeModulesPath(): Promise<string> {
  const CROSS_PLATFORM_REGEX = /\r?\n|\r/g
  return ((await sh('npm root -g')) as any).stdout.replace(
    CROSS_PLATFORM_REGEX,
    ''
  )
}

export function spawnProcess(
  command: string,
  args: string[],
  onClose?: () => string
): void {
  const childProcess = spawn(command, args, { shell: true }) // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
  childProcess.stdout.on('data', out => {
    process.stdout.write(out)
  })
  childProcess.stderr.on('data', stderr => {
    process.stderr.write(stderr)
  })
  childProcess.on('close', code => {
    onClose && onClose()
    process.stdout.write(`child process exited with code ${code}`)
  })
}

export function spawnNpmScript(script: string, onClose?: () => string): void {
  spawnProcess('npm', ['run', script], onClose)
}
