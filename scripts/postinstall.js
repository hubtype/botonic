#!/usr/bin/env node

var Mixpanel = require('mixpanel');

var mixpanel = Mixpanel.init('0a2a173a8daecb5124492f9d319ca429', {
    protocol: 'https'
});

mixpanel.track('botonic_install');