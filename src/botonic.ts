import { join, resolve } from 'path'
import * as fs from 'fs'
import { homedir } from 'os'
import * as next from 'next'
import axios from 'axios'
import { Component }  from './react/component'
const FormData = require('form-data');
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { hashElement } = require('folder-hash');
const ora = require('ora')

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
  private lastRoutePath: any
  public React: any = {Component: Component}

  constructor(config_path: string) {
    this.path = config_path
    this.conf = require(join(this.path, '/.next/botonic.config.js'))
    process.chdir(this.path)
    this.app = next({ dev: false })
  }

  getAction(input: any) {
    let routeParams: any = {}
    //get ChildRoute depending of the past routepath
    let lastRouteChilds = this.getLastChildRoutes(this.lastRoutePath, this.conf.routes)
    if(lastRouteChilds) { //get route depending of current ChildRoute
      routeParams = this.getRoute(input, lastRouteChilds)
    }
    if(!routeParams || !Object.keys(routeParams).length) {
      /*
        we couldn't find a route in the state of the lastRoute, so let's find in
        the general conf.route
      */
      this.lastRoutePath = null
      routeParams = this.getRoute(input, this.conf.routes)
    }
    if(!routeParams || !Object.keys(routeParams).length)
      return {action: '404', params:{}}

    if('action' in routeParams.route) {
      if(this.lastRoutePath)
        this.lastRoutePath = `${this.lastRoutePath}/${routeParams.route.action}`
      else
        this.lastRoutePath = routeParams.route.action
      return {action: routeParams.route.action, params: routeParams.params}
    } else if('redirect' in routeParams.route) {
        this.lastRoutePath = routeParams.route.redirect
        let path = routeParams.route.redirect.split('/')
        return {action: path[path.length - 1], params: {}}
    }
    return {action: '404', params:{}}
  }

  getRoute(input: any, routes:any) {
    /*
      Find the input throw the routes, if it match with some of the entries,
      return the hole Route of the entry with optional params (used in regEx)
    */
    let params: object = {}
    let route = routes.find((r: object) => Object.entries(r)
      .filter(([key, value]) => key != 'action' || 'childRoutes')
      .some(([key, value]) => {
        let match = this.matchRoute(key, value, input)
        try {
          params = match.groups
        } catch(e) {}
        return Boolean(match)
      })
    )
    if(route)
      return {route: route, params}
    return null
  }

  getLastChildRoutes(path: any, routeList: any): any {
    /*
      Recursive function that iterates throw a string composed of
      a set of action separated by '/' ex: 'action1/action2',
      and find if the action match with an entry. Then if it has childs,
      check if the childs can match with the next action.
    */
    if(!path) return null
    var childRoutes = []
    let [currentPath, ...childPath] = path.split('/')
    for(let r of routeList) { //iterate over all routeList
      if(r.action == currentPath)
        childRoutes = r.childRoutes
      if(childRoutes && childRoutes.length && childPath.length > 0) {
        //evaluate childroute over next actions
        childRoutes = this.getLastChildRoutes(childPath.join('/'), childRoutes)
        if(childRoutes && childRoutes.length) return childRoutes //if we find return it
      } else if(childRoutes && childRoutes.length) return childRoutes //last action and finded route
    }
    return null
  }

  matchRoute(prop: string, matcher: any, input: any): any {
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
    if(typeof matcher === 'string')
      return value == matcher
    if(matcher instanceof RegExp)
      return matcher.exec(value)
    if(typeof matcher === 'function')
      return matcher(value)
    return false
  }

  async processInput(input: any, routePath: string,  context: any = {}) {
    if(input.type == 'text') {
      let intent: any = await this.getIntent(input)
      if (intent){
          input.intent = intent.data.result.metadata.intentName;
          input.entities = intent.data.result.parameters;
      }
    }
    if(routePath)
      this.lastRoutePath = routePath
    let {action, params} = this.getAction(input)
    let component = 'actions/' + action
    const req = {
      headers: {},
      method: 'GET',
      url: component,
      input: input,
      context: context,
      params: params
    }
    const res = {}
    const pathname = component
    const query = {routePath: this.lastRoutePath}
    return this.app.renderToHTML(req, res, pathname, query, {})
  }

  async getWebview(webview_name: any, context: any) {
    let component = join('/webviews', webview_name)
    const req = {headers: {}, method: 'GET', url: component, context: context}
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
        this.headers = {Authorization: `Bearer ${this.oauth.access_token}`}
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
        files: { include: ['*.js'] }
    }
    let hash = await hashElement('.', options)
    return hash.hash
  }

  async build() {
    let spinner = new ora({
      text: 'Building...',
      spinner: 'bouncingBar'
    }).start()
    var build_out = await exec('npm run build')
    if (build_out.stderr){
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

  async api(path: string, body: any = null, method: string = 'get', headers: object | null = null, params: any = null): Promise<any> {
    return axios({
      method: method,
      url: this.baseApiUrl + path,
      headers: headers || this.headers,
      data: body,
      params: params
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

  async getBots() {
    return this.api('bots/', null, 'get', null , {organization_id: this.me.organization_id})
  }

  async getProviders() {
    return this.api('provider_accounts/', null, 'get', null, {bot_id: this.bot.id})
  }

  async deployBot(bundlePath: string, password: any): Promise<any> {
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
