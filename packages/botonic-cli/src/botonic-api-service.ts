import axios, { AxiosPromise, Method } from 'axios'
import childProcess from 'child_process'
import colors from 'colors'
import FormData from 'form-data'
import { createReadStream, unlinkSync } from 'fs'
import ora from 'ora'
import qs from 'qs'
import * as util from 'util'

import { BotInfo, OAuth } from './interfaces'

const exec = util.promisify(childProcess.exec)
import {
  BotCredentialsHandler,
  GlobalCredentialsHandler,
} from './analytics/credentials-handler'
import { pathExists } from './util/file-system'

const BOTONIC_CLIENT_ID: string =
  process.env.BOTONIC_CLIENT_ID || 'jOIYDdvcfwqwSs7ZJ1CpmTKcE7UDapZDOSobFmEp'
const BOTONIC_URL: string = process.env.BOTONIC_URL || 'https://api.hubtype.com'

export class BotonicAPIService {
  clientId: string = BOTONIC_CLIENT_ID
  baseUrl: string = BOTONIC_URL
  baseApiUrl = this.baseUrl + '/v1/'
  loginUrl: string = this.baseUrl + '/o/token/'
  botCredentialsHandler = new BotCredentialsHandler()
  globalCredentialsHandler = new GlobalCredentialsHandler()
  oauth?: OAuth
  me: any
  analytics: any
  bot: BotInfo | null
  headers: Record<string, string> | null = null

  constructor() {
    this.loadGlobalCredentials()
    this.loadBotCredentials()
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
      if (this.oauth) {
        this.headers = {
          Authorization: `Bearer ${this.oauth.access_token}`,
          'content-type': 'application/json',
          'x-segment-anonymous-id': this.analytics.anonymous_id,
        }
      }
    }
  }

  loadBotCredentials(): void {
    const credentials = this.botCredentialsHandler.load()
    if (credentials) {
      // eslint-disable-next-line no-prototype-builtins
      if (credentials.hasOwnProperty('bot')) {
        this.bot = credentials.bot
      } else {
        // Allow users < v0.1.12 to upgrade smoothly
        this.bot = credentials as any as BotInfo
      }
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

  async api(
    path: string,
    body: any = null,
    method: Method = 'get',
    headers: any = null,
    params: any = null
  ): Promise<any> {
    let b = 0
    try {
      return await axios({
        method: method,
        url: this.baseApiUrl + path,
        headers: headers || this.headers,
        data: body,
        params: params,
      })
    } catch (e: any) {
      if (e.response.status == 401) {
        b = 1
      } else {
        return e
      }
    }
    if (b == 1) {
      await this.refreshToken()
    }
    return axios({
      method: method,
      url: this.baseApiUrl + path,
      headers: headers || this.headers,
      data: body,
      params: params,
    })
  }

  async refreshToken(): Promise<any> {
    const data = qs.stringify({
      callback: 'none',
      grant_type: 'refresh_token',
      refresh_token: this.getOauth().refresh_token,
      client_id: this.clientId,
    })

    const resp = await axios({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'post',
      url: this.loginUrl,
      data: data,
    })
    if (!resp) return
    this.oauth = resp.data
    this.headers = {
      Authorization: `Bearer ${this.getOauth().access_token}`,
      'content-type': 'application/json',
      'x-segment-anonymous-id': this.analytics.anonymous_id,
    }
    this.saveGlobalCredentials()
    // eslint-disable-next-line consistent-return
    return resp
  }

  async login(email: string, password: string): Promise<any> {
    const data = qs.stringify({
      username: email,
      password: password,
      grant_type: 'password',
      client_id: this.clientId,
    })

    let resp = await axios({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'post',
      url: this.loginUrl,
      data: data,
    })
    this.oauth = resp.data
    this.headers = {
      Authorization: `Bearer ${this.getOauth().access_token}`,
      'content-type': 'application/json',
      'x-segment-anonymous-id': this.analytics.anonymous_id,
    }
    resp = await this.api('users/me')
    if (resp) this.me = resp.data
    return resp
  }

  signup(
    email: string,
    password: string,
    org_name: string,
    campaign: any
  ): Promise<any> {
    const url = `${this.baseApiUrl}users/`
    const signup_data = { email, password, org_name, campaign }
    return axios({ method: 'post', url: url, data: signup_data })
  }

  async saveBot(botName: string): Promise<AxiosPromise> {
    const resp = await this.api('bots/', { name: botName }, 'post')
    if (resp.data) this.setCurrentBot(resp.data)
    return resp
  }

  async getMe(): Promise<AxiosPromise> {
    return this.api('users/me/')
  }

  async getBots(): Promise<AxiosPromise> {
    return this.api('bots/bots_paginator/', null, 'get', null, {
      organization_id: this.me.organization_id,
    })
  }

  async getMoreBots(bots: any, nextBots: any) {
    if (!nextBots) return bots
    const resp = await this.api(
      nextBots.split(this.baseApiUrl)[1],
      null,
      'get',
      null
    )
    resp.data.results.map(b => bots.push(b))
    nextBots = resp.data.next
    return this.getMoreBots(bots, nextBots)
  }

  async getProviders(): Promise<AxiosPromise> {
    return this.api('provider_accounts/', null, 'get', null, {
      bot_id: this.botInfo().id,
    })
  }

  async deployBot(bundlePath: string): Promise<any> {
    try {
      const _authenticated = await this.getMe()
    } catch (e) {
      console.log(`Error authenticating: ${String(e)}`)
    }
    const form = new FormData()
    const data = createReadStream(bundlePath)
    form.append('bundle', data, 'botonic_bundle.zip')
    const headers = await this.getHeaders(form)
    return await this.api(
      `bots/${this.botInfo().id}/deploy_botonic_new/`,
      form,
      'post',
      { ...this.headers, ...headers },
      { version: '0.7' }
    )
  }

  async deployStatus(deployId: string): Promise<AxiosPromise> {
    return this.api(
      `bots/${this.botInfo().id}/deploy_botonic_status/`,
      null,
      'get',
      null,
      { deploy_id: deployId }
    )
  }

  async getHeaders(form: any): Promise<Record<string, any>> {
    //https://github.com/axios/axios/issues/1006#issuecomment-352071490
    return new Promise((resolve, reject) => {
      form.getLength((err: any, length: any) => {
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
