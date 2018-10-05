import { resolve } from 'path'
import { Command, flags } from '@oclif/command'
import { prompt } from 'inquirer'
import * as colors from 'colors'

const fs = require('fs')
const ora = require('ora')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

import { BotonicAPIService } from '../botonicAPIService'
import { track } from '../utils'


export default class Run extends Command {
  static description = 'Deploy Botonic project to botonic.io cloud'

  static examples = [
    `$ botonic deploy
Building...
Creating bundle...
Uploading...
🚀 Bot deployed!
`,
  ]

  static args = [{ name: 'bot_name' }]

  private botonicApiService: BotonicAPIService = new BotonicAPIService()

  async run() {
    const { args, flags } = this.parse(Run)

    const path = flags.path ? resolve(flags.path) : process.cwd()

    if (!this.botonicApiService.oauth)
      await this.signupFlow()
    else
      await this.deployBotFlow()

    track('botonic_deploy')
  }

  async signupFlow() {
    let choices = [
      "No, I need to create a new one (Signup)",
      "Yes, I do. (Login)"
    ]
    return prompt([{
      type: 'list',
      name: 'signupConfirmation',
      message: 'You need to login before deploying your bot.\nDo you have a Botonic account already?',
      choices: choices
    }]).then((inp: any) => {
      if (inp.signupConfirmation == choices[1])
        return this.askLogin()
      else
        return this.askSignup()
    });
  }

  async askEmailPassword() {
    return prompt([{
      type: 'input',
      name: 'email',
      message: 'email:'
    },
    {
      type: 'password',
      name: 'password',
      mask: '*',
      message: 'password:'
    }])
  }

  async askLogin() {
    await this.askEmailPassword().then((inp: any) => this.login(inp.email, inp.password))
  }

  async askSignup() {
    await this.askEmailPassword().then((inp: any) => this.signup(inp.email, inp.password))
  }

  async deployBotFlow() {
    if (!this.botonicApiService.bot)
      return this.newBotFlow()
    else
      return this.deploy()
  }

  async login(email: string, password: string) {
    return this.botonicApiService.login(email, password)
      .then(({ }) => this.deployBotFlow(), (err) => {
        if (err.response && err.response.data && err.response.data.error_description)
          console.log(colors.red(err.response.data.error_description))
        else
          console.log(colors.red('There was an error when trying to log in. Please, try again:'))
        this.askLogin()
      })
  }

  async signup(email: string, password: string) {
    let org_name = email.split('@')[0]
    let campaign = { product: 'botonic' }
    return this.botonicApiService.signup(email, password, org_name, campaign)
      .then(({ }) => this.login(email, password),
        (err) => {
          if (err.response.data.email)
            console.log(colors.red(err.response.data.email[0]))
          if (err.response.data.password)
            console.log(colors.red(err.response.data.password[0]))
          if (!err.response.data.email && !err.response.data.password)
            console.log(colors.red('There was an error trying to signup. Please, try again:'))
          this.askSignup()
        })
  }

  async newBotFlow() {
    this.botonicApiService.getBots()
      .then((resp) => {
        let bots = resp.data.results
        if (!bots.length) {
          return this.createNewBot()
        } else {
          return prompt([
            {
              type: 'confirm',
              name: 'create_bot_confirm',
              message: 'Do yout want to create a new Bot?'
            }]).then((res: any) => {
              let confirm = res.create_bot_confirm
              if (confirm) {
                return this.createNewBot()
              } else {
                return this.selectExistentBot(bots)
              }
            })
        }
      })
  }

  async createNewBot() {
    return prompt([{
      type: 'input',
      name: 'bot_name',
      message: 'Bot name:'
    }]).then((inp: any) => {
      this.botonicApiService.saveBot(inp.bot_name).then(({ }) => this.deploy(),
        (err) => console.log(colors.red('There was an error saving the bot'), err))
    })
  }

  async selectExistentBot(bots: any[]) {
    return prompt([{
      type: 'list',
      name: 'bot_name',
      message: 'Please, select a bot',
      choices: bots.map(b => b.name)
    }]).then((inp: any) => {
      let bot = bots.filter(b => b.name === inp.bot_name)[0]
      this.botonicApiService.setCurrentBot(bot)
      this.deploy()
    })
  }

  async displayProviders(providers: any) {
    console.log('Your bot is published on:')
    providers.map((p: any) => {
      if (p.provider === 'facebook')
        console.log(`💬  [facebook] https://m.me/${p.username}`)
      if (p.provider === 'telegram')
        console.log(`💬  [telegram] https://t.me/${p.username}`)
      if (p.provider === 'twitter')
        console.log(`💬  [twitter] https://t.me/${p.username}`)
      if (p.provider === 'generic')
        console.log(`💬  Your app or website`)
    })
  }

  async deploy() {
    let build_out = await this.botonicApiService.buildIfChanged()
    if (!build_out) {
      console.log(colors.red('There was a problem building the bot'))
      return
    }
    let zip_password = Math.round(Math.random() * 10000000000)
    let spinner = new ora({
      text: 'Creating bundle...',
      spinner: 'bouncingBar'
    }).start()
    let zip_cmd = `zip -P ${zip_password} -r botonic_bundle.zip dist`;
    let zip_out = await exec(zip_cmd)
    const zip_stats = fs.statSync('botonic_bundle.zip')
    spinner.succeed()
    if (zip_stats.size >= 10 ** 7) {
      spinner.fail()
      console.log(colors.red(`Deploy failed. Bundle size too big ${zip_stats.size} (max 1Mb).`))
      await exec('rm botonic_bundle.zip')
      return
    }
    spinner = new ora({
      text: 'Uploading...',
      spinner: 'bouncingBar'
    }).start()
    try {
      await this.botonicApiService.deployBot('botonic_bundle.zip', zip_password)
      spinner.succeed()
      console.log(colors.green('\n🚀  Bot deployed!\n'))
      this.botonicApiService.getProviders()
        .then((resp) => {
          if (!resp) return;
          let providers = resp.data.results
          if (!providers.length) {
            let links = `Now, you can integrate a channel in:\nhttps://app.botonic.io/bots/${this.botonicApiService.bot.id}/integrations?access_token=${this.botonicApiService.oauth.access_token}`;
            console.log(links)
          } else {
            this.displayProviders(providers)
          }
        },
          (err) => console.log(colors.red('There was an error getting the providers'), err))
    } catch (err) {
      spinner.fail()
      console.log(err)
      console.log(colors.red('There was a problem in the deploy'))
    }
    let rm_zip = await exec('rm botonic_bundle.zip')
    this.botonicApiService.beforeExit()
  }
}
