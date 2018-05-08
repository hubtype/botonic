const fs = require('fs')
const os = require('os')
const path = require('path')
const Mixpanel = require('mixpanel')

const mixpanel_token = 'c73e2685df454183c0f97fbf2052d827'

var mixpanel: any
var credentials: any
const botonic_home_path: string = path.join(os.homedir(), '.botonic')
const botonic_credentials_path = path.join(botonic_home_path, 'credentials.json')

export function initializeCredentials() {
  if(!fs.existsSync(botonic_home_path))
    fs.mkdirSync(botonic_home_path)
  let distinct_id = Math.round(Math.random()*100000000)
  fs.writeFileSync(botonic_credentials_path,
    JSON.stringify({mixpanel: {distinct_id}}))
}

function readCredentials() {
  if (!fs.existsSync(botonic_credentials_path)) {
    initializeCredentials()
  }
  try {
    credentials = JSON.parse(fs.readFileSync())
  } catch(e) {}
}

readCredentials()

if(!process.env.BOTONIC_DISABLE_MIXPANEL)
  mixpanel = Mixpanel.init(mixpanel_token, {
    protocol: 'https'
  })

export function track(event: string) {
  if(!process.env.BOTONIC_DISABLE_MIXPANEL && mixpanel && credentials && credentials.mixpanel)
    mixpanel.track(event, {distinct_id: credentials.mixpanel ? credentials.mixpanel.distinct_id : null})
}

export function alias(email: string) {
  if(!process.env.BOTONIC_DISABLE_MIXPANEL && mixpanel && credentials && credentials.mixpanel && email) {
    mixpanel.alias(credentials.mixpanel.distinct_id, email, (e:any) => {console.log(e)})
    credentials.mixpanel.distinct_id = email
    fs.writeFileSync(botonic_credentials_path, JSON.stringify(credentials))
  }
}

export function botonicPostInstall() {
  track('botonic_install')
  if(!process.env.BOTONIC_DISABLE_MIXPANEL) {
    try {
      initializeCredentials()
      readCredentials()
    } catch(e) {}
  }
}
