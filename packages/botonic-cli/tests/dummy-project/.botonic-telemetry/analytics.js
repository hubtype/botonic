const Analytics = require('analytics-node')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { execSync } = require('child_process')

function readJSON(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'))
}

function writeJSON(path, object) {
  fs.writeFileSync(path, JSON.stringify(object))
}

function isWindows() {
  return os.platform() === 'win32'
}

function execCommand(command) {
  try {
    return String(execSync(command)).trim()
  } catch (e) {
    return String(e)
  }
}

function getBotonicDependencies() {
  try {
    const packageJSON = readJSON('package.json')
    const botonicDependencies = Object.entries(
      packageJSON.dependencies
    ).filter(([k, _]) => k.includes('@botonic'))
    return botonicDependencies
  } catch (e) {
    return String(e)
  }
}

const botonicHomePath = path.join(os.homedir(), '.botonic')
const botonicCredentialsPath = path.join(botonicHomePath, 'credentials.json')
const ANALYTICS_KEY = 'YD0jpJHNGW12uhLNbgB4wbdTRQ4Cy1Zu'

let credentials
const analytics = new Analytics(ANALYTICS_KEY, { flushAt: 1 })

function isAnalyticsEnabled() {
  return process.env.BOTONIC_DISABLE_ANALYTICS !== '1'
}

function getSystemInformation() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
    is_tty: process.stdout.isTTY,
    framework_path: __dirname,
    system_path: isWindows()
      ? execCommand('echo %PATH%')
      : execCommand('echo $PATH'),
    node_version: execCommand('node --version'),
    botonic_cli_version: execCommand('botonic --version'),
    botonic_dependencies: getBotonicDependencies(),
  }
}

function initializeCredentials() {
  if (!fs.existsSync(botonicHomePath)) fs.mkdirSync(botonicHomePath)
  const anonymous_id = Math.round(Math.random() * 100000000)
  writeJSON(botonicCredentialsPath, { analytics: { anonymous_id } })
}

function readCredentials() {
  if (!fs.existsSync(botonicCredentialsPath)) {
    initializeCredentials()
  }
  try {
    credentials = readJSON(botonicCredentialsPath)
  } catch (e) {
    if (fs.existsSync(botonicCredentialsPath)) {
      console.warn('Credentials could not be loaded', e)
    }
  }
}

function track(event, properties = {}) {
  if (
    isAnalyticsEnabled() &&
    analytics &&
    credentials &&
    credentials.analytics
  ) {
    properties = {
      ...getSystemInformation(),
      ...properties,
    }
    analytics.track({
      event: event,
      anonymousId: credentials.analytics.anonymous_id,
      properties: properties,
    })
  }
}

const MODE = process.argv[2]
try {
  readCredentials()
  if (MODE === 'serve') track('Served Botonic CLI')
  if (MODE === 'train') track('Trained with Botonic train')
} catch (e) {
  console.warn('Error tracking event', e)
}
