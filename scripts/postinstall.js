#!/usr/bin/env node

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

var utils = require('../lib/utils');

try {
    utils.botonicPostInstall();
} catch(e) {
    //Some users don't have the right permissions to
    //create dirs at instal time. We delay it until
    //they run their first command.
    const Mixpanel = require('mixpanel')
    mixpanel = Mixpanel.init(utils.mixpanel_token, {
        protocol: 'https'
    })
    mixpanel.track('botonic_install')
}

console.log('\n✨ Botonic was installed successfully.\n')
console.log('Create your first chatbot with:\n\x1b[1mbotonic new myBot\x1b[0m')
