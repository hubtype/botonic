import { join, resolve } from 'path'
import * as fs from 'fs'
import { homedir } from 'os'
import * as next from 'next'
import axios from 'axios'
const FormData = require('form-data');

const BOTONIC_CLIENT_ID: string = process.env.BOTONIC_CLIENT_ID || 'jOIYDdvcfwqwSs7ZJ1CpmTKcE7UDapZDOSobFmEp'
const BOTONIC_CLIENT_SECRET: string = process.env.BOTONIC_CLIENT_SECRET || 'YY34FaaNMnIVKztd6LbLIKn3wFqtiLhDgl6ZVyICwsLVWkZN9UzXw0GXFMmWinP3noNGU9Obtb6Nrr1BwMc4IlCTcRDOKJ96JME5N02IGnIY62ZUezMgfeiUZUmMSu68'
const BOTONIC_URL: string = process.env.BOTONIC_URL || 'https://api.hubtype.com'

export class Botonic {
  public current_path: string = process.cwd()
  public bot_path: string = join(this.current_path, '/.botonic.json')
  public path: string
  public conf: any
  private app: any
  private df_session_id: number = Math.random()

  constructor(config_path: string) {
    this.path = config_path
    this.conf = require(join(this.path, '/.next/botonic.config.js'))
    process.chdir(this.path)
    this.app = next({ dev: false })
  }

  getAction(input: any) {
    let route = this.conf.routes.find((r: object) => Object.entries(r)
      .filter(([key, value]) => key != 'action')
      .every(([key, value]) => this.matchRoute(key, value, input)))

    return route? route.action : '404'
  }

  matchRoute(prop: string, matcher: any, input: any): boolean {
    /*
      prop: ('text' | 'payload' | 'intent')
      matcher: (string: exact match | regex: regular expression match | function: return true)
      input: user input object, ex: {type: 'text', data: 'Hi'}
    */
    let value: string = ''
    if(prop in input)
      value = input[prop]
    else if(prop == 'text')
      if(input.type == 'text')
        value = input.data
      if(input.type == 'postback')
        value = input.payload
    if(typeof matcher === 'string')
      return value == matcher
    if(matcher instanceof RegExp)
      return matcher.test(value)
    if(typeof matcher === 'function')
      return matcher(value)
    return false
  }

  async processInput(input: any) {
    if(input.type == 'text') {
      let intent: any = await this.getIntent(input)
      if(intent)
        input.intent = intent.data.result.action
    }
    let component = 'actions/' + this.getAction(input)
    const req = {headers: {}, method: 'GET', url: component}
    const res = {}
    const pathname = component
    const query = {}
    return this.app.renderToHTML(req, res, pathname, query, {})
  }

  async getIntent(input: any): Promise<any> {
    if(this.conf.integrations && this.conf.integrations.dialogflow) {
      return axios({
          headers: {
            Authorization: 'Bearer ' + this.conf.integrations.dialogflow.token
          },
          url: 'https://api.dialogflow.com/v1/query',
          params: {
            query: input.data, lang: 'en', sessionId: this.df_session_id
          }
        })
      }
  }
}

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
  public bot: any
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
    } catch(e) {}
    if(credentials) {
      this.oauth = credentials.oauth
      this.me = credentials.me
      this.mixpanel = credentials.mixpanel
      if(credentials.oauth)
        this.headers = {Authorization: `Bearer ${this.oauth.access_token}`}
    }
  }

  loadBotCredentials() {
    try {
      this.bot = JSON.parse(fs.readFileSync(this.botCredentialsPath, 'utf8'))
    } catch(e) {}
  }

  saveGlobalCredentials() {
    fs.writeFileSync(this.globalCredentialsPath, JSON.stringify({
      oauth: this.oauth,
      me: this.me,
      mixpanel: this.mixpanel
    }))
  }

  saveBotCredentials() {
    fs.writeFileSync(this.botCredentialsPath, JSON.stringify(this.bot))
  }

  setCurrentBot(bot: any) {
    this.bot = bot
  }

  async api(path: string, body: any = null, method: string = 'get', headers: object | null = null): Promise<any> {
    return axios({
      method: method,
      url: this.baseApiUrl + path,
      headers: headers || this.headers,
      data: body
    })
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
    this.headers = {Authorization: `Bearer ${this.oauth.access_token}`}
    resp = await this.api('users/me')
    this.me = resp.data
    return resp
  }

  signup(email:string, password:string, org_name:string, campaign:any): Promise<any>{
    let url = `${this.baseApiUrl}users/`
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
    this.setCurrentBot(resp.data)
  }

  async getBots() {
    let resp = await this.api('bots/', {organization: this.me.organization_id})
    return resp.data.results
  }

  async deployBot(bundlePath: string): Promise<any> {
    const form = new FormData()
    let data = fs.createReadStream(bundlePath)
    form.append('bundle', data, 'botonic_bundle.zip')
    let headers = await this.getHeaders(form)
    return this.api(`bots/${this.bot.id}/deploy_botonic/`, form, 'post', {...this.headers, ...headers})
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
