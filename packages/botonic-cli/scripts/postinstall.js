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
  telemetry.trackInstallBotonic()
  console.log('\n✨ Botonic was installed successfully.\n')
  console.log(
    'Create your first chatbot with:\n\x1b[1mbotonic new myBot\x1b[0m\n'
  )
} catch (e) {
  if (process.env.BOTONIC_DISABLE_ANALYTICS !== '1') {
    const Analytics = require('analytics-node')
    var analytics = new Analytics('YD0jpJHNGW12uhLNbgB4wbdTRQ4Cy1Zu', {
      flushAt: 1,
    })
    const { v4 } = require('uuid')
    analytics.track({
      event: 'Installed Botonic CLI',
      anonymousId: v4(),
      properties: { error: `postinstall exception: ${String(e)}` },
    })
  }
}
