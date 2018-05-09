#!/usr/bin/env node

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
