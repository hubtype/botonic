import Analytics from 'analytics-node'
import { exec, spawn } from 'child_process'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

export let analytics: Analytics

export let credentials: any
export const botonic_home_path: string = path.join(os.homedir(), '.botonic')
export const botonic_credentials_path = path.join(
  botonic_home_path,
  'credentials.json'
)

export function initializeCredentials() {
  if (!fs.existsSync(botonic_home_path)) fs.mkdirSync(botonic_home_path)
  const anonymous_id = Math.round(Math.random() * 100000000)
  fs.writeFileSync(
    botonic_credentials_path,
    JSON.stringify({ analytics: { anonymous_id } })
  )
}

function readCredentials() {
  if (!fs.existsSync(botonic_credentials_path)) {
    initializeCredentials()
  }
  try {
    credentials = JSON.parse(fs.readFileSync(botonic_credentials_path, 'utf8'))
  } catch (e) {
    if (fs.existsSync(botonic_credentials_path)) {
      console.warn('Credentials could not be loaded', e)
    }
  }
}

try {
  readCredentials()
} catch (e) {
  console.warn('Credentials could not be loaded', e)
}

function analytics_enabled() {
  return process.env.BOTONIC_DISABLE_ANALYTICS !== '1'
}

if (analytics_enabled()) {
  analytics = new Analytics('YD0jpJHNGW12uhLNbgB4wbdTRQ4Cy1Zu')
}

export function track(event: string, properties = {}) {
  if (analytics_enabled() && analytics && credentials && credentials.analytics)
    analytics.track({
      event: event,
      anonymousId: credentials.analytics.anonymous_id,
      properties: properties,
    })
}

export function botonicPostInstall() {
  if (analytics_enabled()) {
    initializeCredentials()
    readCredentials()
    track('Installed Botonic CLI')
  }
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function sh(cmd) {
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

export async function getGlobalNodeModulesPath() {
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
  const childProcess = spawn(command, args)
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
