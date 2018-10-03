import { join, resolve } from 'path'
import * as fs from 'fs'
import { homedir } from 'os'
import axios from 'axios'
const FormData = require('form-data');
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { hashElement } = require('folder-hash');
const ora = require('ora')

const BOTONIC_CLIENT_ID: string = process.env.BOTONIC_CLIENT_ID || 'jOIYDdvcfwqwSs7ZJ1CpmTKcE7UDapZDOSobFmEp'
const BOTONIC_CLIENT_SECRET: string = process.env.BOTONIC_CLIENT_SECRET || 'YY34FaaNMnIVKztd6LbLIKn3wFqtiLhDgl6ZVyICwsLVWkZN9UzXw0GXFMmWinP3noNGU9Obtb6Nrr1BwMc4IlCTcRDOKJ96JME5N02IGnIY62ZUezMgfeiUZUmMSu68'
const BOTONIC_URL: string = process.env.BOTONIC_URL || 'https://api.hubtype.com'

export class BotonicAPIService {
  public cliendId: string = BOTONIC_CLIENT_ID
  public clientSecret: string = BOTONIC_CLIENT_SECRET
  public baseUrl: string = BOTONIC_URL
  public baseApiUrl = this.baseUrl + '/v1/'
  public loginUrl: string = this.baseUrl + '/o/token/'
  public botPath: string = process.cwd()
  public botCredentialsPath: string = join(this.botPath, '/.botonic.json')
  public globalConfigPath: string = join(homedir(), '/.botonic')
  public globalCredentialsPath: string = join(this.globalConfigPath, '/credentials.json')
  public oauth: any
  public me: any
  public mixpanel: any
  public lastBuildHash: any
  public bot: any = null
  public headers: object | null = null

  constructor() {
    this.loadGlobalCredentials()
    this.loadBotCredentials()
  }

  beforeExit() {
    this.saveGlobalCredentials()
    this.saveBotCredentials()
  }

  loadGlobalCredentials() {
    try {
      var credentials = JSON.parse(fs.readFileSync(this.globalCredentialsPath, 'utf8'))
      var mixpanel = credentials.mixpanel ? credentials.mixpanel : credentials.me.campaign.mixpanel_id
    } catch(e) {}
    if(credentials) {
      this.oauth = credentials.oauth
      this.me = credentials.me
      this.mixpanel = mixpanel
      if(credentials.oauth)
        this.headers = {
          Authorization: `Bearer ${this.oauth.access_token}`,
          'content-type': 'application/json'
        }
    }
  }

  loadBotCredentials() {
    try {
      var credentials = JSON.parse(fs.readFileSync(this.botCredentialsPath, 'utf8'))
    } catch(e) {}
    if(credentials) {
      if(credentials.hasOwnProperty('bot')) {
        this.bot = credentials.bot
        this.lastBuildHash = credentials.lastBuildHash
      } else { // Allow users < v0.1.12 to upgrade smoothly
        this.bot = credentials
        this.lastBuildHash = ''
      }
    }
  }

  async checkGlobalCredentialsPath() {
    if(!fs.existsSync(this.globalConfigPath))
      fs.mkdirSync(this.globalConfigPath)
  }

  async saveGlobalCredentials() {
    await this.checkGlobalCredentialsPath()
    fs.writeFileSync(this.globalCredentialsPath, JSON.stringify({
      oauth: this.oauth,
      me: this.me,
      mixpanel: this.mixpanel
    }))
  }

  saveBotCredentials() {
    let bc = {bot: this.bot, lastBuildHash: this.lastBuildHash}
    fs.writeFileSync(this.botCredentialsPath, JSON.stringify(bc))
  }

  async getCurrentBuildHash() {
    const options = {
        folders: { exclude: ['.*', 'node_modules'] },
        files: { include: ['*.js', '*.css'] }
    }
    let hash = await hashElement('.', options)
    return hash.hash
  }

  async build() {
    let spinner = new ora({
      text: 'Building...',
      spinner: 'bouncingBar'
    }).start()
    try {
      var build_out = await exec('npm run build')
    } catch (error){
      spinner.fail()
      return false
    }
    spinner.succeed()
    return true
  }

  async buildIfChanged() {
    let hash = await this.getCurrentBuildHash()
    if(hash != this.lastBuildHash) {
      this.lastBuildHash = hash
      return await this.build()
    }
    return true
  }

  setCurrentBot(bot: any) {
    this.bot = bot
  }

  setMixpanelInfo(mixpanel_id: any) {
    this.mixpanel = { 'mixpanel_id' :  mixpanel_id  }
  }

  logout() {
    if(fs.existsSync(this.globalCredentialsPath))
      fs.unlinkSync(this.globalCredentialsPath)
  }

  async api(path: string, body: any = null, method: string = 'get', headers: any | null = null, params: any = null): Promise<any> {

    var b = 0
    try {
      return await axios({
        method: method,
        url: this.baseApiUrl + path,
        headers: headers || this.headers,
        data: body,
        params: params
      })} catch(e) {
        b = 1
      }
    if(b == 1){
      await this.refreshToken()
    }

    return await axios({
        method: method,
        url: this.baseApiUrl + path,
        headers: headers || this.headers,
        data: body,
        params: params
      })
  }

  async refreshToken(): Promise<any> {
    let resp = await axios({
      method: 'post',
      url: this.loginUrl,
      params: {
        'callback': 'none',
        'grant_type': 'refresh_token',
        'refresh_token': this.oauth.refresh_token,
        'client_id': this.cliendId,
        'client_secret': this.clientSecret
      }
    })
    if(!resp) return;
    this.oauth = resp.data
    this.headers = {Authorization: `Bearer ${this.oauth.access_token}`}
    await this.saveGlobalCredentials()
    return resp
  }

  async login(email:any, password:any): Promise<any> {
    let resp = await axios({
      method: 'post',
      url: this.loginUrl,
      params: {
        'username': email,
        'password': password,
        'client_id': this.cliendId,
        'client_secret': this.clientSecret,
        'grant_type': 'password'
      }
    })
    this.oauth = resp.data
    this.headers = {
      Authorization: `Bearer ${this.oauth.access_token}`,
      'content-type': 'application/json'
    }
    resp = await this.api('users/me')
    if(resp)
      this.me = resp.data
    return resp
  }

  signup(email:string, password:string, org_name:string, campaign:any): Promise<any>{
    let url = `${this.baseApiUrl}users/`
    if(campaign)
      campaign.mixpanel_id = this.mixpanel ? this.mixpanel.distinct_id : Math.round(Math.random()*10000000000)
    let signup_data = {email, password, org_name, campaign}
    return axios({
      method: 'post',
      url: url,
      data: signup_data
    })
  }

  async saveBot(bot_name: string) {
    let resp = await this.api('bots/',
        {name: bot_name, framework: 'framework_botonic'}, 'post')
    if(resp.data)
      this.setCurrentBot(resp.data)
    return resp
  }

  async getMe() {
    return this.api('users/me/')
  }

  async getBots() {
    return this.api('bots/', null, 'get', null , {organization_id: this.me.organization_id})
  }

  async getProviders() {
    return this.api('provider_accounts/', null, 'get', null, {bot_id: this.bot.id})
  }

  async deployBot(bundlePath: string, password: any): Promise<any> {
    try {
      let a = await this.getMe()
    } catch(e){
      console.log(e)
    }
    const form = new FormData()
    let data = fs.createReadStream(bundlePath)
    form.append('bundle', data, 'botonic_bundle.zip')
    let headers = await this.getHeaders(form)
    return this.api(`bots/${this.bot.id}/deploy_botonic/`, form, 'post', {...this.headers, ...headers}, {password: password})
  }

  async getHeaders(form: any) {
    //https://github.com/axios/axios/issues/1006#issuecomment-352071490
    return new Promise((resolve, reject) => {
      form.getLength((err: any, length: any) => {
        if(err) { reject(err) }
        let headers = Object.assign({'Content-Length': length}, form.getHeaders())
        resolve(headers)
       })
    })
  }

}
