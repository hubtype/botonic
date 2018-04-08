import { join, resolve } from 'path'
import { Command, flags } from '@oclif/command'
//const next = require('next')
import * as next from 'next'
//import dynamic from 'next/dynamic'
import { load } from 'cheerio'
import axios from 'axios'
import * as fs from 'fs'

var Mixpanel = require('mixpanel');

export default class Run extends Command {
  static description = 'Create a new Botonic project'

  static examples = [
    `$ botonic new test_bot
Creating...
  💫 test_bot was successfully created!
`,
  ]

  static args = [{name: 'bot_name'}]

  private mixpanel = Mixpanel.init('0a2a173a8daecb5124492f9d319ca429', {
    protocol: 'https'
  });

  async run() {
    this.mixpanel.track('botonic_new');
    const {args, flags} = this.parse(Run)
    fs.mkdir(args.name, err => { if (err) console.log(err) });
  }
}