/* eslint-disable @typescript-eslint/naming-convention */
import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosPromise,
  AxiosResponse,
} from 'axios'
import childProcess from 'child_process'
import colors from 'colors'
import FormData from 'form-data'
import { createReadStream, unlinkSync } from 'fs'
import ora from 'ora'
import { stringify } from 'qs'
import * as util from 'util'

import {
  BotCredentialsHandler,
  GlobalCredentialsHandler,
} from './analytics/credentials-handler'
import { AnalyticsInfo, BotInfo, BotsList, Me, OAuth } from './interfaces'
import { BotConfigJson } from './util/bot-config-json'
import { pathExists } from './util/file-system'

const exec = util.promisify(childProcess.exec)

const BOTONIC_CLIENT_ID: string =
  process.env.BOTONIC_CLIENT_ID || 'jOIYDdvcfwqwSs7ZJ1CpmTKcE7UDapZDOSobFmEp'
const BOTONIC_URL: string = process.env.BOTONIC_URL || 'https://api.hubtype.com'

interface RequestArgs {
  apiVersion?: string
  path: string
  body?: any
  headers?: any
  params?: any
}
export class BotonicAPIService {
  clientId: string = BOTONIC_CLIENT_ID
  baseUrl: string = BOTONIC_URL
  loginUrl: string = this.baseUrl + '/o/token/'
  botCredentialsHandler = new BotCredentialsHandler()
  globalCredentialsHandler = new GlobalCredentialsHandler()
  oauth?: OAuth
  me?: Me
  analytics: AnalyticsInfo
  bot: BotInfo | null
  headers: AxiosHeaders
  apiClient: AxiosInstance

  constructor() {
    this.loadGlobalCredentials()
    this.loadBotCredentials()

    this.apiClient = axios.create({
      baseURL: BOTONIC_URL,
      headers: this.headers,
    })

    const onFullfilled = (response: AxiosResponse) => {
      return response
    }

    const onRejected = async (error: any) => {
      const originalRequest = error.config
      const retry = originalRequest?._retry
      if (error.response?.status === 401 && !retry) {
        originalRequest._retry = true
        await this.refreshToken()
        return this.apiClient.request(originalRequest)
      }
      return Promise.reject(error)
    }

    this.apiClient.interceptors.response.use(onFullfilled, onRejected)
  }

  beforeExit(): void {
    this.saveGlobalCredentials()
    this.saveBotCredentials()
  }

  botInfo(): BotInfo {
    if (!this.bot) {
      throw new Error('Not bot info available')
    }
    return this.bot
  }

  getOauth(): OAuth {
    if (!this.oauth) {
      throw new Error('Not OAuth available')
    }
    return this.oauth
  }

  loadGlobalCredentials(): void {
    const credentials = this.globalCredentialsHandler.load()
    if (credentials) {
      this.oauth = credentials.oauth
      this.me = credentials.me
      this.analytics = credentials.analytics

      this.setHeaders()
    }
  }

  private setHeaders() {
    if (this.oauth) {
      this.headers = new AxiosHeaders({
        Authorization: `Bearer ${this.oauth.access_token}`,
        'content-type': 'application/json',
        'x-segment-anonymous-id': this.analytics.anonymous_id,
      })
    }
  }

  loadBotCredentials(): void {
    const credentials = this.botCredentialsHandler.load()

    if (credentials?.bot) {
      this.bot = credentials.bot
    }
  }

  saveGlobalCredentials(): void {
    this.globalCredentialsHandler.createDirIfNotExists()
    this.globalCredentialsHandler.dump({
      oauth: this.oauth,
      me: this.me,
      analytics: this.analytics,
    })
  }

  saveBotCredentials(): void {
    this.botCredentialsHandler.dump({
      bot: this.bot,
    })
  }

  async build(npmCommand = 'build'): Promise<boolean> {
    const spinner = ora({
      text: 'Building...',
      spinner: 'bouncingBar',
    }).start()
    try {
      await exec(`npm run ${npmCommand}`)
    } catch (error: any) {
      spinner.fail()
      console.log(
        `${String(error.stdout)}` +
          colors.red(`\n\nBuild error:\n${String(error)}`)
      )
      return false
    }
    spinner.succeed()
    return true
  }

  setCurrentBot(bot: any): void {
    this.bot = bot
  }

  logout(): void {
    const pathToCredentials = this.globalCredentialsHandler.pathToCredentials
    if (pathExists(pathToCredentials)) unlinkSync(pathToCredentials)
  }

  async apiPost({
    apiVersion = 'v1',
    path,
    body,
    headers,
    params,
  }: RequestArgs): Promise<any> {
    return this.apiClient.post(`${this.baseUrl}/${apiVersion}/${path}`, body, {
      headers: headers || this.headers,
      params,
    })
  }

  async apiGet({
    apiVersion = 'v1',
    path,
    headers,
    params,
  }: RequestArgs): Promise<any> {
    return this.apiClient.get(`${this.baseUrl}/${apiVersion}/${path}`, {
      headers: headers || this.headers,
      params,
    })
  }

  async refreshToken(): Promise<any> {
    const data = stringify({
      callback: 'none',
      grant_type: 'refresh_token',
      refresh_token: this.getOauth().refresh_token,
      client_id: this.clientId,
    })

    const resp = await axios.post(this.loginUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (!resp) return
    this.oauth = resp.data
    this.headers = new AxiosHeaders({
      Authorization: `Bearer ${this.getOauth().access_token}`,
      'content-type': 'application/json',
      'x-segment-anonymous-id': this.analytics.anonymous_id,
    })
    this.saveGlobalCredentials()
    // eslint-disable-next-line consistent-return
    return resp
  }

  async login(email: string, password: string): Promise<void> {
    const data = stringify({
      username: email,
      password: password,
      grant_type: 'password',
      client_id: this.clientId,
    })

    const loginResponse = await axios.post(this.loginUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    this.oauth = loginResponse.data

    this.headers = new AxiosHeaders({
      Authorization: `Bearer ${this.getOauth().access_token}`,
      'content-type': 'application/json',
      'x-segment-anonymous-id': this.analytics.anonymous_id,
    })
    const meResponse = await this.apiGet({ path: 'users/me' })
    if (meResponse) this.me = meResponse.data
  }

  signup(
    email: string,
    password: string,
    orgName: string,
    campaign: any
  ): Promise<any> {
    const signupData = { email, password, org_name: orgName, campaign }
    return this.apiPost({ path: 'users/', body: signupData })
  }

  async saveBot(botName: string): Promise<AxiosPromise> {
    const resp = await this.apiPost({
      apiVersion: 'v2',
      path: 'bots/',
      body: { name: botName },
    })
    if (resp.data) this.setCurrentBot(resp.data)
    return resp
  }

  async getMe(): Promise<AxiosPromise> {
    return this.apiGet({ path: 'users/me/' })
  }

  async getBots(): AxiosPromise<BotsList> {
    return this.apiGet({ apiVersion: 'v2', path: 'bots/' })
  }

  async getMoreBots(bots: any, nextBots: any) {
    if (!nextBots) return bots
    const resp = await this.apiGet({
      path: nextBots.split(this.baseUrl)[1],
    })
    resp.data.results.map(b => bots.push(b))
    nextBots = resp.data.next
    return this.getMoreBots(bots, nextBots)
  }

  async getProviders(): Promise<AxiosPromise> {
    return this.apiGet({
      path: 'provider_accounts/',
      params: {
        bot_id: this.botInfo().id,
      },
    })
  }

  async deployBot(
    bundlePath: string,
    botConfigJson: BotConfigJson
  ): Promise<any> {
    try {
      const _authenticated = await this.getMe()
    } catch (e) {
      console.log(`Error authenticating: ${String(e)}`)
    }

    const form = new FormData()
    const data = createReadStream(bundlePath)
    form.append('bundle', data, 'botonic_bundle.zip')
    form.append('bot_config', JSON.stringify(botConfigJson))
    const headers = await this.getHeaders(form)

    return await this.apiPost({
      apiVersion: 'v2',
      path: `bots/${this.botInfo().id}/deploy/`,
      body: form,
      headers: {
        ...this.headers,
        ...headers,
      },
    })
  }

  async deployStatus(deployId: string): Promise<AxiosPromise> {
    return this.apiGet({
      apiVersion: 'v2',
      path: `bots/${this.botInfo().id}/deploy_status/`,
      params: { deploy_id: deployId },
    })
  }

  async getHeaders(form: FormData): Promise<Record<string, any>> {
    //https://github.com/axios/axios/issues/1006#issuecomment-352071490
    return new Promise((resolve, reject) => {
      form.getLength((err: any, length: number) => {
        if (err) {
          reject(err)
        }
        const headers = Object.assign(
          { 'Content-Length': length },
          form.getHeaders()
        )
        resolve(headers)
      })
    })
  }
}
