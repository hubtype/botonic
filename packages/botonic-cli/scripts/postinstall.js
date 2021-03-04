/*console.log(`
 ________  ________  _________  ________  ________   ___  ________     
|\   __  \|\   __  \|\___   ___\\   __  \|\   ___  \|\  \|\   ____\    
\ \  \|\ /\ \  \|\  \|___ \  \_\ \  \|\  \ \  \\ \  \ \  \ \  \___|    
 \ \   __  \ \  \\\  \   \ \  \ \ \  \\\  \ \  \\ \  \ \  \ \  \       
  \ \  \|\  \ \  \\\  \   \ \  \ \ \  \\\  \ \  \\ \  \ \  \ \  \____  
   \ \_______\ \_______\   \ \__\ \ \_______\ \__\\ \__\ \__\ \_______\
    \|_______|\|_______|    \|__|  \|_______|\|__| \|__|\|__|\|_______|
                                                                       
                                                                       
                                                                       
Build chatbots with React
`)*/

try {
  const { Telemetry } = require('../lib/analytics/telemetry')
  const telemetry = new Telemetry()
  telemetry.trackInstalledBotonic()
  console.log('\n✨ Botonic was installed successfully.\n')
  console.log(
    'Create your first chatbot with:\n\x1b[1mbotonic new myBot\x1b[0m\n'
  )
} catch (e) {
  const { getSystemInformation } = require('../lib/util/processes')
  if (process.env.BOTONIC_DISABLE_ANALYTICS !== '1') {
    const Analytics = require('analytics-node')
    var analytics = new Analytics('YD0jpJHNGW12uhLNbgB4wbdTRQ4Cy1Zu', {
      flushAt: 1,
    })
    const properties = { ...getSystemInformation(), error: String(e) }
    analytics.track({
      event: 'Installed Botonic CLI',
      anonymousId: Math.round(Math.random() * 100000000),
      properties,
    })
  }
}
