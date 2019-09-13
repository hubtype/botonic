const fs = require('fs')
const os = require('os')
const path = require('path')
const Analytics = require('analytics-node')
import { exec } from 'child_process'

export var analytics: any

export var credentials: any
export const botonic_home_path: string = path.join(os.homedir(), '.botonic')
export const botonic_credentials_path = path.join(
  botonic_home_path,
  'credentials.json'
)

export function initializeCredentials() {
  if (!fs.existsSync(botonic_home_path)) fs.mkdirSync(botonic_home_path)
  let anonymous_id = Math.round(Math.random() * 100000000)
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
    credentials = JSON.parse(fs.readFileSync(botonic_credentials_path))
  } catch (e) {}
}

try {
  readCredentials()
} catch (e) {}

function analytics_enabled() {
  return process.env.BOTONIC_DISABLE_ANALYTICS !== '1'
}

if (analytics_enabled()) {
  analytics = new Analytics('YD0jpJHNGW12uhLNbgB4wbdTRQ4Cy1Zu')
}

export function track(event: string, properties: {} = {}) {
  if (analytics_enabled() && analytics && credentials && credentials.analytics)
    analytics.track({
      event: event,
      anonymousId: credentials.analytics.anonymous_id,
      properties: properties
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
  return new Promise(function(resolve, reject) {
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
