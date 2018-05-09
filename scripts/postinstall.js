#!/usr/bin/env node

try {
    var utils = require('../lib/utils');
    utils.botonicPostInstall();
} catch(e) {
    //Some users don't have the right permissions to
    //create dirs at instal time. We delay it until
    //they run their first command.
}
