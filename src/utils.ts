const fs = require('fs')
const os = require('os')
const path = require('path')
const Mixpanel = require('mixpanel')

const mixpanel_token = '0a2a173a8daecb5124492f9d319ca429'

var mixpanel: any
var credentials: any
const botonic_home_path: string = path.join(os.homedir(), '.botonic')

function readCredentials() {
  try {
    credentials = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.botonic', 'credentials.json')))
  } catch(e) {}
}

readCredentials()

if(!process.env.BOTONIC_DISABLE_MIXPANEL)
  mixpanel = Mixpanel.init(mixpanel_token, {
    protocol: 'https'
  })

export function track(event: string) {
  if(mixpanel)
    mixpanel.track(event, {distinct_id: credentials? credentials.mixpanel.distinct_id : null})
}

export function botonicPostInstall() {
  let distinct_id = Math.round(Math.random()*100000000)
  if(!fs.existsSync(botonic_home_path))
    fs.mkdirSync(botonic_home_path)
  fs.writeFileSync(path.join(botonic_home_path, 'credentials.json'),
    JSON.stringify({mixpanel: {distinct_id}}))
  readCredentials()
  track('botonic_install')
}