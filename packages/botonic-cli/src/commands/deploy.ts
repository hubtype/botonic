import { PulumiRunner } from '@botonic/pulumi/lib/pulumi-runner'
import { Command, flags } from '@oclif/command'
import { AxiosError } from 'axios'
import colors from 'colors'
import { statSync } from 'fs'
// eslint-disable-next-line import/named
import { prompt } from 'inquirer'
import ora from 'ora'
import { join } from 'path'
// eslint-disable-next-line import/named
import { ZipAFolder } from 'zip-a-folder'

import { Telemetry } from '../analytics/telemetry'
import { BotonicAPIService } from '../botonic-api-service'
import { CLOUD_PROVIDERS, PATH_TO_AWS_CONFIG } from '../constants'
import {
  copy,
  createDir,
  pathExists,
  removeRecursively,
} from '../util/file-system'
import { sleep } from '../util/system'

let npmCommand: string | undefined

const BOTONIC_BUNDLE_FILE = 'botonic_bundle.zip'
const BOTONIC_TEMP_DIRNAME = 'tmp'

export default class Run extends Command {
  static description = 'Deploy Botonic project to cloud provider'

  static examples = [
    `$ botonic deploy
Building...
Creating bundle...
Uploading...
🚀 Bot deployed!
`,
    `$ botonic deploy aws
Deploying to AWS...
`,
  ]
  static flags = {
    command: flags.string({
      char: 'c',
      description: 'Command to execute from the package "scripts" object',
    }),
    email: flags.string({
      char: 'e',
      description: 'Email from Hubtype Organization',
    }),
    password: flags.string({
      char: 'p',
      description: 'Password from Hubtype Organization',
    }),
    botName: flags.string({
      char: 'b',
      description: 'Name of the bot from Hubtype where you want to deploy',
    }),
  }

  static args = [{ name: 'provider', options: Object.values(CLOUD_PROVIDERS) }]

  private botonicApiService: BotonicAPIService = new BotonicAPIService()
  private botName: string | undefined = undefined
  private telemetry = new Telemetry()

  /* istanbul ignore next */
  async run(): Promise<void> {
    const { flags, args } = this.parse(Run)
    const provider = args.provider
    if (provider && provider !== CLOUD_PROVIDERS.HUBTYPE) {
      this.deployToProvider(provider)
    } else {
      this.telemetry.trackDeploy()
      npmCommand = flags.command
      this.botName = flags.botName
      const email = flags.email
      const password = flags.password
      if (email && password) await this.login(email, password)
      else if (!this.botonicApiService.oauth) await this.signupFlow()
      else if (this.botName) {
        await this.deployBotFromFlag(this.botName)
      } else await this.deployBotFlow()
    }
  }

  async deployToProvider(provider: string): Promise<void> {
    this.telemetry.trackDeploy1_0({ provider })
    if (provider === CLOUD_PROVIDERS.AWS) {
      console.log(`Deploying to ${CLOUD_PROVIDERS.AWS}...`)
      console.log('This can take a while, do not cancel this process.')
      const pulumiRunner = new PulumiRunner(PATH_TO_AWS_CONFIG)
      try {
        await pulumiRunner.deploy()
      } catch (e) {
        const error = `Deploy Botonic 1.0 ${provider} Error: ${String(e)}`
        this.telemetry.trackError(error)
        throw new Error(e)
      }
    }
  }

  async deployBotFromFlag(botName: string): Promise<void> {
    const resp = await this.botonicApiService.getBots()
    const nextBots = resp.data.next
    const bots = resp.data.results
    if (nextBots) {
      await this.botonicApiService.getMoreBots(bots, nextBots)
    }
    const bot = bots.filter(b => b.name === botName)[0]
    if (bot == undefined) {
      console.log(colors.red(`Bot ${botName} doesn't exist.`))
      console.log('\nThese are the available options:')
      bots.map(b => console.log(` > ${String(b.name)}`))
    } else {
      this.botonicApiService.setCurrentBot(bot)
      await this.deploy()
    }
  }

  signupFlow(): Promise<void> {
    const choices = [
      'No, I need to create a new one (Signup)',
      'Yes, I do. (Login)',
    ]
    return prompt([
      {
        type: 'list',
        name: 'signupConfirmation',
        message:
          'You need to login before deploying your bot.\nDo you have a Hubtype account already?',
        choices: choices,
      },
    ]).then((inp: any) => {
      if (inp.signupConfirmation == choices[1]) return this.askLogin()
      else return this.askSignup()
    })
  }

  askEmailPassword(): Promise<{ email: string; password: string }> {
    return prompt([
      {
        type: 'input',
        name: 'email',
        message: 'email:',
      },
      {
        type: 'password',
        name: 'password',
        mask: '*',
        message: 'password:',
      },
    ])
  }

  async askLogin(): Promise<void> {
    await this.askEmailPassword().then(inp =>
      this.login(inp.email, inp.password)
    )
  }

  async askSignup(): Promise<void> {
    await this.askEmailPassword().then(inp =>
      this.signup(inp.email, inp.password)
    )
  }

  async deployBotFlow() {
    if (this.botName) return this.deployBotFromFlag(this.botName)
    if (!this.botonicApiService.bot) return this.newBotFlow()
    else {
      const resp = await this.botonicApiService.getBots()
      const nextBots = resp.data.next
      const bots = resp.data.results
      if (nextBots) {
        await this.botonicApiService.getMoreBots(bots, nextBots)
      }
      // Show the current bot in credentials at top of the list
      const first_id = this.botonicApiService.bot.id
      bots.sort(function (x, y) {
        return x.id == first_id ? -1 : y.id == first_id ? 1 : 0
      })
      return this.selectExistentBot(bots)
    }
  }

  async login(email: string, password: string): Promise<void> {
    return this.botonicApiService.login(email, password).then(
      ({}) => this.deployBotFlow(),
      async (err: AxiosError) => {
        if (
          err.response &&
          err.response.data &&
          err.response.data.error_description
        ) {
          console.log(colors.red(err.response.data.error_description))
        } else {
          console.log(
            colors.red(
              'There was an error when trying to log in. Please, try again:'
            )
          )
          if (err.response && err.response.status && err.response.statusText) {
            console.error(
              `Error ${err.response.status}: ${err.response.statusText}`
            )
          }
        }
        await this.askLogin()
      }
    )
  }

  async signup(email: string, password: string): Promise<void> {
    const org_name = email.split('@')[0]
    const campaign = { product: 'botonic' }
    return this.botonicApiService
      .signup(email, password, org_name, campaign)
      .then(
        ({}) => this.login(email, password),
        async err => {
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
          await this.askSignup()
        }
      )
  }

  async newBotFlow() {
    const resp = await this.botonicApiService.getBots()
    const nextBots = resp.data.next
    const bots = resp.data.results
    if (nextBots) {
      const _new_bots = await this.botonicApiService.getMoreBots(bots, nextBots)
    }
    if (!bots.length) {
      return this.createNewBot()
    } else {
      return prompt([
        {
          type: 'confirm',
          name: 'create_bot_confirm',
          message: 'Do you want to create a new Bot?',
        },
      ]).then((res: any) => {
        const confirm = res.create_bot_confirm
        if (confirm) {
          return this.createNewBot()
        } else {
          return this.selectExistentBot(bots)
        }
      })
    }
  }

  createNewBot(): Promise<void> {
    return prompt([
      {
        type: 'input',
        name: 'bot_name',
        message: 'Bot name:',
      },
    ]).then((inp: any) => {
      return this.botonicApiService.saveBot(inp.bot_name).then(
        ({}) => this.deploy(),
        err =>
          console.log(
            colors.red(`There was an error saving the bot: ${String(err)}`)
          )
      )
    })
  }

  selectExistentBot(bots: any[]): Promise<void> {
    return prompt([
      {
        type: 'list',
        name: 'bot_name',
        message: 'Please, select a bot',
        choices: bots.map(b => b.name),
      },
    ]).then((inp: { bot_name: string }) => {
      const bot = bots.filter(b => b.name === inp.bot_name)[0]
      this.botonicApiService.setCurrentBot(bot)
      return this.deploy()
    })
  }

  displayProviders(providers: { username: string; provider: string }[]): void {
    console.log('Your bot is published on:')
    providers.forEach(p => {
      if (p.provider === 'whatsapp')
        console.log(`💬  [whatsapp] https://wa.me/${p.username}`)
      if (p.provider === 'facebook')
        console.log(`💬  [facebook] https://m.me/${p.username}`)
      if (p.provider === 'telegram')
        console.log(`💬  [telegram] https://t.me/${p.username}`)
      if (p.provider === 'twitter')
        console.log(`💬  [twitter] https://t.me/${p.username}`)
      if (p.provider === 'generic') console.log(`💬  Your app or website`)
    })
  }

  async createBundle(): Promise<void> {
    const spinner = ora({
      text: 'Creating bundle...',
      spinner: 'bouncingBar',
    }).start()
    if (pathExists(BOTONIC_TEMP_DIRNAME))
      removeRecursively(BOTONIC_TEMP_DIRNAME)
    createDir(join(process.cwd(), BOTONIC_TEMP_DIRNAME))
    copy('dist', join(BOTONIC_TEMP_DIRNAME, 'dist'))
    const zipRes = await ZipAFolder.zip(
      BOTONIC_TEMP_DIRNAME,
      join(BOTONIC_BUNDLE_FILE)
    )
    if (zipRes instanceof Error) {
      throw Error
    }
    const zipStats = statSync(BOTONIC_BUNDLE_FILE)
    spinner.succeed()
    if (zipStats.size >= 10 * 10 ** 6) {
      spinner.fail()
      console.log(
        colors.red(
          `Deploy failed. Bundle size too big ${zipStats.size} (max 10Mb).`
        )
      )
      const error = 'Deploy Botonic Zip Error'
      this.telemetry.trackError(error)
      return
    }
  }

  /* istanbul ignore next */
  async deployBundle(): Promise<{ hasDeployErrors: boolean }> {
    const spinner = ora({
      text: 'Deploying...',
      spinner: 'bouncingBar',
    }).start()
    try {
      const deploy = await this.botonicApiService.deployBot(
        join(process.cwd(), BOTONIC_BUNDLE_FILE)
      )
      if (
        (deploy.response && deploy.response.status == 403) ||
        !deploy.data.deploy_id
      ) {
        const error = `Deploy Botonic Error: ${String(
          deploy.response.data.status
        )}`
        this.telemetry.trackError(error)
        throw deploy.response.data.status
      }
      // eslint-disable-next-line no-constant-condition
      while (true) {
        await sleep(500)
        const deployStatus = await this.botonicApiService.deployStatus(
          deploy.data.deploy_id
        )
        if (deployStatus.data.is_completed) {
          if (deployStatus.data.status == 'deploy_status_completed_ok') {
            spinner.succeed()
            console.log(colors.green('\n🚀  Bot deployed!\n'))
            return { hasDeployErrors: false }
          } else throw deployStatus.data.error
        }
      }
    } catch (err) {
      spinner.fail()
      const error = String(err)
      console.log(colors.red('There was a problem in the deploy:'))
      console.log(colors.red(error))
      this.telemetry.trackError(`Deploy Botonic Error: ${error}`)
      return { hasDeployErrors: true }
    }
  }

  /* istanbul ignore next */
  async displayDeployResults({ hasDeployErrors }): Promise<boolean> {
    try {
      const providersRes = await this.botonicApiService.getProviders()
      const providers = providersRes.data.results
      if (hasDeployErrors) return false
      if (!providers.length) {
        const botId = this.botonicApiService.botInfo().id
        const accessToken = this.botonicApiService.getOauth().access_token
        const links =
          'Now, you can integrate a channel in:' +
          `\nhttps://app.hubtype.com/bots/${botId}/integrations?access_token=${accessToken}`
        console.log(links)
      } else {
        this.displayProviders(providers)
      }
      return true
    } catch (e) {
      const error = `Deploy Botonic Provider Error: ${String(e)}`
      this.telemetry.trackError(error)
      console.log(
        colors.red(`There was an error getting the providers: ${String(e)}`)
      )
      return false
    }
  }

  /* istanbul ignore next */
  async deploy(): Promise<void> {
    try {
      const buildOut = await this.botonicApiService.build(npmCommand)
      if (!buildOut) {
        const error = 'Deploy Botonic Build Error'
        this.telemetry.trackError(error)
        console.log(colors.red('There was a problem building the bot'))
        return
      }
      await this.createBundle()
      const { hasDeployErrors } = await this.deployBundle()
      await this.displayDeployResults({ hasDeployErrors })
    } catch (e) {
      console.log(colors.red('Deploy Error'), e)
    } finally {
      removeRecursively(BOTONIC_BUNDLE_FILE)
      removeRecursively(BOTONIC_TEMP_DIRNAME)
      this.botonicApiService.beforeExit()
    }
  }
}
