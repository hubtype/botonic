import { Command, flags } from '@oclif/command'
import { prompt } from 'inquirer'
import * as colors from 'colors'

const fs = require('fs')
const ora = require('ora')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

import { BotonicAPIService } from '../botonicAPIService'
import { track, sleep } from '../utils'

var force = false

export default class Run extends Command {
  static description = 'Deploy Botonic project to hubtype.com'

  static examples = [
    `$ botonic deploy
Building...
Creating bundle...
Uploading...
🚀 Bot deployed!
`
  ]
  static flags = {
    force: flags.boolean({
      char: 'f',
      description: 'Force deploy despite of no changes. Disabled by default'
    }),
    botName: flags.string()
  }

  static args = [{ name: 'bot_name' }]

  private botonicApiService: BotonicAPIService = new BotonicAPIService()

  async run() {
    const { args, flags } = this.parse(Run)
    track('Deployed Botonic CLI')

    force = flags.force ? flags.force : false
    let botName = flags.botName ? flags.botName : false

    if (!this.botonicApiService.oauth) await this.signupFlow()
    else if (botName) {
      this.deployBotFromFlag(botName)
    } else await this.deployBotFlow()
  }

  async deployBotFromFlag(botName: string) {
    let resp = await this.botonicApiService.getBots()
    let nextBots = resp.data.next
    let bots = resp.data.results
    if (nextBots) {
      await this.botonicApiService.getMoreBots(bots, nextBots)
    }
    let bot = bots.filter(b => b.name === botName)[0]
    if (bot == undefined) {
      console.log(colors.red(`Bot ${botName} doesn't exist.`))
      console.log('\nThese are the available options:')
      bots.map(b => console.log(` > ${b.name}`))
    } else {
      this.botonicApiService.setCurrentBot(bot)
      this.deploy()
    }
  }

  async signupFlow() {
    let choices = [
      'No, I need to create a new one (Signup)',
      'Yes, I do. (Login)'
    ]
    return prompt([
      {
        type: 'list',
        name: 'signupConfirmation',
        message:
          'You need to login before deploying your bot.\nDo you have a Hubtype account already?',
        choices: choices
      }
    ]).then((inp: any) => {
      if (inp.signupConfirmation == choices[1]) return this.askLogin()
      else return this.askSignup()
    })
  }

  async askEmailPassword() {
    return prompt([
      {
        type: 'input',
        name: 'email',
        message: 'email:'
      },
      {
        type: 'password',
        name: 'password',
        mask: '*',
        message: 'password:'
      }
    ])
  }

  async askLogin() {
    await this.askEmailPassword().then((inp: any) =>
      this.login(inp.email, inp.password)
    )
  }

  async askSignup() {
    await this.askEmailPassword().then((inp: any) =>
      this.signup(inp.email, inp.password)
    )
  }

  async deployBotFlow() {
    if (!this.botonicApiService.bot) return this.newBotFlow()
    else {
      let resp = await this.botonicApiService.getBots()
      let nextBots = resp.data.next
      let bots = resp.data.results
      if (nextBots) {
        await this.botonicApiService.getMoreBots(bots, nextBots)
      }
      // Show the current bot in credentials at top of the list
      let first_id = this.botonicApiService.bot.id
      bots.sort(function(x, y) {
        return x.id == first_id ? -1 : y.id == first_id ? 1 : 0
      })
      return this.selectExistentBot(bots)
    }
  }

  async login(email: string, password: string) {
    return this.botonicApiService.login(email, password).then(
      ({}) => this.deployBotFlow(),
      err => {
        if (
          err.response &&
          err.response.data &&
          err.response.data.error_description
        )
          console.log(colors.red(err.response.data.error_description))
        else
          console.log(
            colors.red(
              'There was an error when trying to log in. Please, try again:'
            )
          )
        this.askLogin()
      }
    )
  }

  async signup(email: string, password: string) {
    let org_name = email.split('@')[0]
    let campaign = { product: 'botonic' }
    return this.botonicApiService
      .signup(email, password, org_name, campaign)
      .then(
        ({}) => this.login(email, password),
        err => {
          if (err.response.data.email)
            console.log(colors.red(err.response.data.email[0]))
          if (err.response.data.password)
            console.log(colors.red(err.response.data.password[0]))
          if (!err.response.data.email && !err.response.data.password)
            console.log(
              colors.red(
                'There was an error trying to signup. Please, try again:'
              )
            )
          this.askSignup()
        }
      )
  }

  async newBotFlow() {
    let resp = await this.botonicApiService.getBots()
    let nextBots = resp.data.next
    let bots = resp.data.results
    if (nextBots) {
      let new_bots = await this.botonicApiService.getMoreBots(bots, nextBots)
    }
    if (!bots.length) {
      return this.createNewBot()
    } else {
      return prompt([
        {
          type: 'confirm',
          name: 'create_bot_confirm',
          message: 'Do you want to create a new Bot?'
        }
      ]).then((res: any) => {
        let confirm = res.create_bot_confirm
        if (confirm) {
          return this.createNewBot()
        } else {
          return this.selectExistentBot(bots)
        }
      })
    }
  }

  async createNewBot() {
    return prompt([
      {
        type: 'input',
        name: 'bot_name',
        message: 'Bot name:'
      }
    ]).then((inp: any) => {
      this.botonicApiService
        .saveBot(inp.bot_name)
        .then(
          ({}) => this.deploy(),
          err =>
            console.log(colors.red(`There was an error saving the bot: ${err}`))
        )
    })
  }

  async selectExistentBot(bots: any[]) {
    return prompt([
      {
        type: 'list',
        name: 'bot_name',
        message: 'Please, select a bot',
        choices: bots.map(b => b.name)
      }
    ]).then((inp: any) => {
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
      if (p.provider === 'generic') console.log(`💬  Your app or website`)
    })
  }

  async deploy() {
    let build_out = await this.botonicApiService.buildIfChanged()
    if (!build_out) {
      track('Deploy Botonic Build Error')
      console.log(colors.red('There was a problem building the bot'))
      return
    }

    let spinner = new ora({
      text: 'Creating bundle...',
      spinner: 'bouncingBar'
    }).start()
    let zip_cmd = `zip -r botonic_bundle.zip dist`
    let zip_out = await exec(zip_cmd)
    const zip_stats = fs.statSync('botonic_bundle.zip')
    spinner.succeed()
    if (zip_stats.size >= 10 * 10 ** 6) {
      spinner.fail()
      console.log(
        colors.red(
          `Deploy failed. Bundle size too big ${zip_stats.size} (max 10Mb).`
        )
      )
      track('Deploy Botonic Zip Error')
      await exec('rm botonic_bundle.zip')
      return
    }
    spinner = new ora({
      text: 'Deploying...',
      spinner: 'bouncingBar'
    }).start()
    try {
      var deploy = await this.botonicApiService.deployBot(
        'botonic_bundle.zip',
        force
      )
      if (
        (deploy.response && deploy.response.status == 403) ||
        !deploy.data.deploy_id
      ) {
        track('Deploy Botonic Error', { error: deploy.response.data.status })
        throw deploy.response.data.status
      }

      while (true) {
        await sleep(500)
        let deploy_status = await this.botonicApiService.deployStatus(
          deploy.data.deploy_id
        )
        if (deploy_status.data.is_completed) {
          if (deploy_status.data.status == 'deploy_status_completed_ok') {
            spinner.succeed()
            console.log(colors.green('\n🚀  Bot deployed!\n'))
            break
          } else {
            spinner.fail()
            console.log(colors.red('There was a problem in the deploy:'))
            console.log(deploy_status.data.error)
            track('Deploy Botonic Error', { error: deploy_status.data.error })
            await exec('rm botonic_bundle.zip')
            return
          }
        }
      }
    } catch (err) {
      spinner.fail()
      console.log(colors.red('There was a problem in the deploy:'))
      console.log(err)
      track('Deploy Botonic Error', { error: err })
      await exec('rm botonic_bundle.zip')
      return
    }
    try {
      let providers_resp = await this.botonicApiService.getProviders()
      let providers = providers_resp.data.results
      if (!providers.length) {
        let links = `Now, you can integrate a channel in:\nhttps://app.hubtype.com/bots/${
          this.botonicApiService.bot.id
        }/integrations?access_token=${
          this.botonicApiService.oauth.access_token
        }`
        console.log(links)
      } else {
        this.displayProviders(providers)
      }
    } catch (e) {
      track('Deploy Botonic Provider Error', { error: e })
      console.log(colors.red(`There was an error getting the providers: ${e}`))
    }
    try {
      await exec('rm botonic_bundle.zip')
    } catch (e) {}
    this.botonicApiService.beforeExit()
  }
}
