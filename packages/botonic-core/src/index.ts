import { join } from 'path'
import axios from 'axios'
import { load } from 'cheerio'
import i18n from './i18n'
const util = require('util')
const url = require('url')

export class Botonic {
  public current_path: string = process.cwd()
  public bot_path: string = join(this.current_path, '/.botonic.json')
  public path: string
  public conf: any
  public routes: any
  private df_session_id: number = Math.random()
  private lastRoutePath: any

  constructor(config_path: string) {
    this.path = config_path
    this.conf = require(join(this.path, '/dist/botonic.config.js'))
    try {
      this.routes = require(join(this.path, '/dist/routes.js')).routes
    } catch (e) {
      this.routes = this.conf.routes
    }

    process.chdir(this.path)
  }

  getAction(input: any, context: any) {
    let brokenFlow = false;
    let routeParams: any = {}
    let lastRoute = this.getLastRoute(this.lastRoutePath, this.routes)
    if (lastRoute && lastRoute.childRoutes) //get route depending of current ChildRoute
      routeParams = this.getRoute(input, lastRoute.childRoutes)
    if (!routeParams || !Object.keys(routeParams).length) {
      /*
        we couldn't find a route in the state of the lastRoute, so let's find in
        the general conf.route
      */
      brokenFlow = Boolean(this.lastRoutePath)
      routeParams = this.getRoute(input, this.routes)
    }
    if (routeParams && Object.keys(routeParams).length) {
      if ('action' in routeParams.route) {
        if (brokenFlow && routeParams.route.ignoreRetry != true &&
          lastRoute && context.__retries < lastRoute.retry &&
          routeParams.route.action != lastRoute.action) {
          context.__retries = context.__retries ? context.__retries + 1 : 1
          // The flow was broken, but we want to recover it
          return {
            action: routeParams.route.action,
            params: routeParams.params,
            retryAction: lastRoute ? lastRoute.action : null
          }
        } else {
          context.__retries = 0
          if (this.lastRoutePath && !brokenFlow)
            this.lastRoutePath = `${this.lastRoutePath}>${routeParams.route.action}`
          else
            this.lastRoutePath = routeParams.route.action
          return {
            action: routeParams.route.action,
            params: routeParams.params,
            retryAction: null
          }
        }
      } else if ('redirect' in routeParams.route) {
        this.lastRoutePath = routeParams.route.redirect
        let path = routeParams.route.redirect.split('>')
        return { action: path[path.length - 1], params: {}, retryAction: null }
      }
    }
    if (lastRoute && context.__retries < lastRoute.retry) {
      context.__retries = context.__retries ? context.__retries + 1 : 1
      return { action: '404', params: {}, retryAction: lastRoute.action }
    } else {
      this.lastRoutePath = null
      context.__retries = 0
      return { action: '404', params: {}, retryAction: null }
    }
  }

  getRoute(input: any, routes: any) {
    /*
      Find the input throw the routes, if it match with some of the entries,
      return the hole Route of the entry with optional params (used in regEx)
    */
    let params: object = {}
    let route = routes.find((r: object) => Object.entries(r)
      .filter(([key, { }]) => key != 'action' || 'childRoutes')
      .some(([key, value]) => {
        let match = this.matchRoute(key, value, input)
        try {
          params = match.groups
        } catch (e) { }
        return Boolean(match)
      })
    )
    if (route){
      return { route: route, params }
    }
    return null
  }

  getLastRoute(path: any, routeList: any): any {
    /*
      Recursive function that iterates throw a string composed of
      a set of action separated by '/' ex: 'action1/action2',
      and find if the action match with an entry. Then if it has childs,
      check if the childs can match with the next action.
    */
    if (!path) return null
    var lastRoute = null
    let [currentPath, ...childPath] = path.split('>')
    for (let r of routeList) { //iterate over all routeList
      if (r.action == currentPath)
        lastRoute = r
      if (r.childRoutes && r.childRoutes.length && childPath.length > 0) {
        //evaluate childroute over next actions
        lastRoute = this.getLastRoute(childPath.join('>'), r.childRoutes)
        if (lastRoute) return lastRoute
      } else if (lastRoute) return lastRoute //last action and finded route
    }
    return null
  }

  matchRoute(prop: string, matcher: any, input: any): any {
    /*
      prop: ('text' | 'payload' | 'intent' | 'type' | 'input' |...)
      matcher: (string: exact match | regex: regular expression match | function: return true)
      input: user input object, ex: {type: 'text', data: 'Hi'}
    */
    let value: string = ''
    if (prop in input)
      value = input[prop]
    else if (prop == 'text'){
      if (input.type == 'text')
        value = input.data
    } else if (prop == 'input')
        value = input
    if (typeof matcher === 'string')
      return value == matcher
    if (matcher instanceof RegExp)
      return matcher.exec(value)
    if (typeof matcher === 'function')
      return matcher(value)      
    return false
  }

  async processInput(input: any, routePath: string, context: any = {}) {
    i18n.setLocale(context.__locale || 'en')
    if (input.type == 'text') {
      try {
        let nlu = await this.getNLU(input)
        Object.assign(input, nlu)
      } catch (e) {
        return Promise.reject(`Error in NLU integration: ${e}`)
      }
    }
    if (routePath)
      this.lastRoutePath = routePath
    let { action, params, retryAction } = await this.getAction(input, context)
    try {
      let payload = input.payload
      let action_params = payload.split('__ACTION_PAYLOAD__')[1].split('?')
      action = action_params[0] || action
      if (action_params.length > 1) {
        let p = new url.URLSearchParams(action_params[1])
        for (let [key, value] of p.entries())
          params[key] = value
      }
    } catch { }

    let ret = await this.renderAction(action, input, context, params)

    if (retryAction)
      ret += await this.renderAction(retryAction, input, context, params)

    return ret
  }

  async renderAction(action, input, context, params) {
    let a = require(join(this.path, `./dist/actions/${action}`)).default
    let req = { input, context, params }
    // Call render method depending on project "flavour" (React, Angular, Vue...)
    const BotonicReact = await import(`${this.path}/node_modules/@botonic/react`)
    let output = await BotonicReact.renderReactAction(req, a)
    let html = load(output)

    let delay = this.conf.typingOptions && this.conf.typingOptions.delay ? this.conf.typingOptions.delay : 0
    let typing = this.conf.typingOptions && this.conf.typingOptions.typing ? this.conf.typingOptions.typing : 0
    html('message').map(({ }, elem) => {
      let e = html(elem)
      e.attr('delay', e.attr('delay') ? e.attr('delay') : delay)
      e.attr('typing', e.attr('typing') ? e.attr('typing') : typing)
    })

    html('[action]').map(({ }, elem) => {
      let e = html(elem)
      e.attr('payload', '__ACTION_PAYLOAD__' + e.attr('action'))
      e.attr('action', null)
    })
    return html.html()
  }

  async getNLU(input: any): Promise<any> {
    let intent = null
    let confidence = 0
    let intents = []
    let entities = []
    if (!this.conf.integrations)
      return { intent, confidence, intents, entities }
    if (this.conf.integrations.dialogflow) {
      try {
        let dialogflow_resp = await axios({
          headers: {
            Authorization: 'Bearer ' + this.conf.integrations.dialogflow.token
          },
          url: 'https://api.dialogflow.com/v1/query',
          params: {
            query: input.data, lang: 'en', sessionId: this.df_session_id
          }
        })
        if (dialogflow_resp && dialogflow_resp.data) {
          intent = dialogflow_resp.data.result.metadata.intentName;
          entities = dialogflow_resp.data.result.parameters;
        }
      } catch (e) { }
    } else if (this.conf.integrations.watson) {
      let w = this.conf.integrations.watson
      const AssistantV1 = await import(`${this.path}/node_modules/watson-developer-cloud/assistant/v1`)
      let assistant = new AssistantV1({ version: '2017-05-26', ...this.conf.integrations.watson });

      assistant.message = util.promisify(assistant.message)

      try {
        let res = await assistant.message({
          input: { text: input.data },
          workspace_id: this.conf.integrations.watson.workspace_id
        })
        intent = res.intents[0].intent
        confidence = res.intents[0].confidence
        intents = res.intents
        entities = res.entities
      } catch (e) { }
    }
    return { intent, confidence, intents, entities }
  }
}

export async function getOpenQueues(req: any) {
  let base_url = req.context._hubtype_api || 'https://api.hubtype.com'
  const queues_url = `${base_url}/v1/queues/get_open_queues/`
  let bot_id = req.context.bot.id
  let resp = await axios({
    headers: {
      Authorization: `Bearer ${req.context._access_token}`
    },
    method: 'post',
    url: queues_url,
    data: { bot_id }
  })
  return resp.data
}

export async function humanHandOff(req: any, queue_name: any = '', on_finish: any = {}) {
  let params = `create_case:${queue_name}`
  if (on_finish) {
    if (on_finish.action)
      params += `:__ACTION_PAYLOAD__${on_finish.action}`
    else if (on_finish.payload)
      params += `:${on_finish.payload}`
  }
  req.context._botonic_action = params
}
