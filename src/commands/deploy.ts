import { join, resolve } from 'path'
import { Command, flags } from '@oclif/command'
//const next = require('next')
import * as next from 'next'
//import dynamic from 'next/dynamic'
import { load } from 'cheerio'
import axios from 'axios'
import chalk from 'chalk'

var Mixpanel = require('mixpanel');

export default class Run extends Command {
  static description = 'Deploy Botonic project to botonic.io cloud'

  static examples = [
    `$ botonic deploy
Deploying...
  🚀 test_bot was successfully deployed!
`,
  ]

  static args = [{name: 'bot_name'}]

  private mixpanel = Mixpanel.init('0a2a173a8daecb5124492f9d319ca429', {
    protocol: 'https'
  });

  async run() {
    this.mixpanel.track('botonic_deploy')
    const c = chalk.hex('#DEADED')
    console.log(c('Hey there, thanks for giving ')
      + c.bold('Botonic')
      + c(' a try!'))
    console.log("We're still developing the first version of Botonic, which is not available yet.")
    console.log("\nWould you like to contribute or send some feedback?\nJust drop us an email at " + chalk.bold("hi@botonic.io"));
  }
}