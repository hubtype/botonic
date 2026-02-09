import { rmSync, statSync } from 'node:fs'
import path from 'node:path'
import { confirm, input, password, select } from '@inquirer/prompts'
import { Args, Command, Flags } from '@oclif/core'
import type { AxiosError } from 'axios'
import ora from 'ora'
import pc from 'picocolors'
import { ZipAFolder } from 'zip-a-folder'

import { BotonicAPIService } from '../botonic-api-service.js'
import { CLOUD_PROVIDERS } from '../constants.js'
import type {
  BotListItem,
  DeployHubtypeFlags,
  LoginErrorData,
} from '../interfaces.js'
import { BotConfig, type BotConfigJSON } from '../util/bot-config.js'
import {
  copyRecursively,
  createDir,
  pathExists,
  removeRecursively,
} from '../util/file-system.js'
import { sleep } from '../util/system.js'

let npmCommand: string | undefined

const BOTONIC_BUNDLE_FILE = 'botonic_bundle.zip'
const BOTONIC_TEMP_DIRNAME = 'tmp'
export default class Deploy extends Command {
  static override args = {
    provider: Args.string({
      description: 'Provider to deploy to',
      options: Object.values(CLOUD_PROVIDERS),
    }),
  }
  static override description = 'Deploy Botonic project to cloud provider'
  static override examples = [
    '$ botonic deploy\nBuilding...\nCreating bundle...\nUploading...\n🚀 Bot deployed!',
  ]
  static override flags = {
    command: Flags.string({
      char: 'c',
      description: 'Command to execute from the package "scripts" object',
    }),
    email: Flags.string({
      char: 'e',
      description: 'Email from Hubtype Organization',
    }),
    password: Flags.string({
      char: 'p',
      description: 'Password from Hubtype Organization',
    }),
    botName: Flags.string({
      char: 'b',
      description: 'Name of the bot from Hubtype where you want to deploy',
    }),
  }

  private botonicApiService: BotonicAPIService = new BotonicAPIService()
  private botName: string | undefined = undefined

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Deploy)

    const provider: string = args.provider || CLOUD_PROVIDERS.HUBTYPE
    // TODO: -> In a next iteration it would be cool to get a prompt asking which provider we prefer (if it's the 1st deploy) or getting the provider from `.botonic.json` (after 1st deploy)
    console.log(`Deploying to ${provider}...`)
    console.log('This can take a while, do not cancel this process.')

    if (provider === CLOUD_PROVIDERS.HUBTYPE) {
      await this.deployHubtype(flags)
    }
  }

  async deployHubtype(flags: DeployHubtypeFlags): Promise<void> {
    npmCommand = flags.command
    this.botName = flags.botName
    const email = flags.email
    const password = flags.password
    if (email && password) {
      await this.login(email, password)
    } else if (!this.botonicApiService.oauth) {
      await this.signupFlow()
    } else if (this.botName) {
      await this.deployBotFromFlag(this.botName)
    } else {
      await this.deployBotFlow()
    }
  }

  async deployBotFromFlag(botName: string): Promise<void> {
    const bots = await this.getAvailableBots()

    const bot = bots.filter(b => b.name === botName)[0]
    if (bot === undefined && !botName) {
      console.log(pc.red(`Bot ${botName} doesn't exist.`))
      console.log('\nThese are the available options:')
      bots.map(b => console.log(` > ${String(b.name)}`))

      return
    } else if (botName) {
      const botByBotName = bots.find(bot => bot.name === botName)
      if (botByBotName) {
        this.botonicApiService.setCurrentBot(bot)
        return await this.deploy()
      }

      const userAnswer = await confirm({
        message: 'Do you want to create a new Bot?',
      })
      if (userAnswer) {
        return this.createNewBot(botName)
      }

      return
    } else {
      this.botonicApiService.setCurrentBot(bot)
      return await this.deploy()
    }
  }

  async signupFlow(): Promise<void> {
    const choices = [
      'No, I need to create a new one (Signup)',
      'Yes, I do. (Login)',
    ]
    const signupConfirmation = await select({
      message:
        'You need to login before deploying your bot.\nDo you have a Hubtype account already?',
      choices: choices,
    })
    if (signupConfirmation === choices[1]) {
      return this.askLogin()
    } else {
      return this.askSignup()
    }
  }

  async askEmailPassword(): Promise<{ email: string; password: string }> {
    const userEmail = await input({ message: 'email:' })
    const userPassword = await password({ message: 'password:', mask: true })
    return { email: userEmail, password: userPassword }
  }

  async askLogin(): Promise<void> {
    const { email, password } = await this.askEmailPassword()
    this.login(email, password)
  }

  async askSignup(): Promise<void> {
    const { email, password } = await this.askEmailPassword()
    this.signup(email, password)
  }

  async deployBotFlow(): Promise<void> {
    if (this.botName) {
      return this.deployBotFromFlag(this.botName)
    }

    if (
      !this.botonicApiService.bot ||
      !Object.keys(this.botonicApiService.bot).length
    ) {
      return this.newBotFlow()
    } else {
      const resp = await this.botonicApiService.getBots()
      const bots = resp.data.results

      // Show the current bot in credentials at top of the list
      const firstId = this.botonicApiService.bot.id
      bots.sort((x, y) => (x.id === firstId ? -1 : y.id === firstId ? 1 : 0))
      return this.selectExistentBot(bots)
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await this.botonicApiService.login(email, password)
      await this.deployBotFlow()
    } catch (err: any) {
      const axiosError = err as AxiosError<LoginErrorData>
      if (axiosError.response?.data?.error_description) {
        console.log(pc.red(axiosError.response.data.error_description))
      } else {
        console.log(
          pc.red('There was an error when trying to log in. Please, try again:')
        )
        if (axiosError.response?.status && axiosError.response?.statusText) {
          console.error(
            `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
          )
        }
      }
      await this.askLogin()
    }
  }

  async signup(email: string, password: string): Promise<void> {
    const orgName = email.split('@')[0]
    const campaign = { product: 'botonic' }
    try {
      await this.botonicApiService.signup(email, password, orgName, campaign)
      await this.login(email, password)
    } catch (err: any) {
      if (err.response?.data?.email) {
        console.log(pc.red(err.response.data.email[0]))
      }
      if (err.response?.data?.password) {
        console.log(pc.red(err.response.data.password[0]))
      }
      if (!err.response?.data?.email && !err.response?.data?.password) {
        console.log(
          pc.red('There was an error trying to signup. Please, try again:')
        )
      }
      await this.askSignup()
    }
  }

  async getAvailableBots(): Promise<BotListItem[]> {
    const resp = await this.botonicApiService.getBots()

    return resp.data.results
  }

  async newBotFlow(): Promise<void> {
    const bots = await this.getAvailableBots()
    if (!bots.length) {
      return this.createNewBot()
    } else {
      const answer = await confirm({
        message: 'Do you want to create a new Bot?',
      })

      if (answer) {
        return this.createNewBot()
      } else {
        return this.selectExistentBot(bots)
      }
    }
  }

  async createNewBotWithName(inpBotName: string): Promise<void> {
    const MAX_ALLOWED_CHARS_FOR_BOT_NAME = 25
    if (inpBotName.length > MAX_ALLOWED_CHARS_FOR_BOT_NAME) {
      throw new Error(
        `Maximum allowed chars for bot name is ${MAX_ALLOWED_CHARS_FOR_BOT_NAME} chars. Please, give a shorter name.`
      )
    }

    try {
      await this.botonicApiService.createBot(inpBotName)
      this.deploy()
    } catch (err: any) {
      console.log(pc.red(`There was an error saving the bot: ${String(err)}`))
    }
  }

  async createNewBot(botName?: string): Promise<void> {
    if (botName) {
      return this.createNewBotWithName(botName)
    }
    const newBotName = await input({ message: 'Bot name:' })

    return await this.createNewBotWithName(newBotName)
  }

  async selectExistentBot(bots: any[]): Promise<void> {
    const botNameSelected = await select({
      message: 'Please, select a bot',
      choices: bots.map(b => b.name),
    })
    const bot = bots.filter(b_1 => b_1.name === botNameSelected)[0]
    this.botonicApiService.setCurrentBot(bot)

    return await this.deploy()
  }

  displayProviders(providers: { username: string; provider: string }[]): void {
    console.log('Your bot is published on:')
    providers.forEach(p => {
      if (p.provider === 'whatsapp') {
        console.log(`💬  [whatsapp] https://wa.me/${p.username}`)
      }
      if (p.provider === 'facebook') {
        console.log(`💬  [facebook] https://m.me/${p.username}`)
      }
      if (p.provider === 'telegram') {
        console.log(`💬  [telegram] https://t.me/${p.username}`)
      }
      if (p.provider === 'twitter') {
        console.log(`💬  [twitter] https://t.me/${p.username}`)
      }
      if (p.provider === 'generic') {
        console.log(`💬  Your app or website`)
      }
    })
  }

  async createBundle(): Promise<void> {
    const spinner = ora({
      text: 'Creating bundle...',
      spinner: 'bouncingBar',
    }).start()

    if (pathExists(BOTONIC_TEMP_DIRNAME)) {
      removeRecursively(BOTONIC_TEMP_DIRNAME)
    }
    createDir(path.join(process.cwd(), BOTONIC_TEMP_DIRNAME))
    copyRecursively('dist', path.join(BOTONIC_TEMP_DIRNAME, 'dist'))
    const zipRes = await ZipAFolder.zip(
      BOTONIC_TEMP_DIRNAME,
      path.join(BOTONIC_BUNDLE_FILE)
    )
    if (zipRes instanceof Error) {
      throw Error
    }
    const zipStats = statSync(BOTONIC_BUNDLE_FILE)
    spinner.succeed()
    if (zipStats.size >= 10 * 10 ** 6) {
      spinner.fail()
      console.log(
        pc.red(
          `Deploy failed. Bundle size too big ${zipStats.size} (max 10Mb).`
        )
      )
      return
    }
  }

  async deployBundle(
    botConfigJson: BotConfigJSON
  ): Promise<{ hasDeployErrors: boolean }> {
    const spinner = ora({
      text: 'Deploying...',
      spinner: 'bouncingBar',
    }).start()
    try {
      const deploy = await this.botonicApiService.deployBot(
        path.join(process.cwd(), BOTONIC_BUNDLE_FILE),
        botConfigJson
      )
      if (deploy.response?.status === 403 || !deploy.data.deploy_id) {
        throw deploy.response.data.status
      }
      // eslint-disable-next-line no-constant-condition
      while (true) {
        await sleep(500)
        const deployStatus = await this.botonicApiService.deployStatus(
          deploy.data.deploy_id
        )
        if (deployStatus.data.is_completed) {
          if (deployStatus.data.status === 'deploy_status_completed_ok') {
            spinner.succeed()
            console.log(pc.green('\n🚀  Bot deployed!\n'))
            return { hasDeployErrors: false }
          } else {
            throw deployStatus.data.error
          }
        }
      }
    } catch (err: any) {
      spinner.fail()
      const error = String(err)
      console.log(pc.red('There was a problem in the deploy:'))
      console.log(pc.red(error))
      return { hasDeployErrors: true }
    }
  }

  async displayDeployResults(hasDeployErrors: boolean): Promise<boolean> {
    try {
      const providersRes = await this.botonicApiService.getProviders()
      const providers = providersRes.data.results
      if (hasDeployErrors) {
        return false
      }
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
      console.log(
        pc.red(`There was an error getting the providers: ${String(e)}`)
      )
      return false
    }
  }

  /* istanbul ignore next */
  async deploy(): Promise<void> {
    try {
      const buildOut = await this.botonicApiService.build(npmCommand)
      if (!buildOut) {
        console.log(pc.red('There was a problem building the bot'))
        return
      }

      const botConfigJson = await BotConfig.get(process.cwd())

      await this.createBundle()
      const { hasDeployErrors } = await this.deployBundle(botConfigJson)
      await this.displayDeployResults(hasDeployErrors)
    } catch (e) {
      console.log(pc.red('Deploy Error'), e)
    } finally {
      rmSync(BOTONIC_BUNDLE_FILE)
      removeRecursively(BOTONIC_TEMP_DIRNAME)
      this.botonicApiService.beforeExit()
    }
  }
}
