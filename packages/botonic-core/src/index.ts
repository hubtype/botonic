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
  private df_session_id: number = Math.random()
  private lastRoutePath: any

  constructor(config_path: string) {
    this.path = config_path
    this.conf = require(join(this.path, '/dist/botonic.config.js'))
    process.chdir(this.path)
  }

  getAction(input: any, context: any) {
    let brokenFlow = false;
    let routeParams: any = {}
    let lastRoute = this.getLastRoute(this.lastRoutePath, this.conf.routes)
    if (lastRoute && lastRoute.childRoutes) //get route depending of current ChildRoute
      routeParams = this.getRoute(input, lastRoute.childRoutes)
    if (!routeParams || !Object.keys(routeParams).length)  {
      /*
        we couldn't find a route in the state of the lastRoute, so let's find in
        the general conf.route
      */
      brokenFlow = Boolean(this.lastRoutePath)
      routeParams = this.getRoute(input, this.conf.routes)
    }
    if (routeParams && Object.keys(routeParams).length) {
      if ('action' in routeParams.route) {
        if (brokenFlow && routeParams.route.ignoreRetry != true &&
          context.__retries < lastRoute.retry &&
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
    if (route)
      return { route: route, params }
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
      prop: ('text' | 'payload' | 'intent' | 'type' | ...)
      matcher: (string: exact match | regex: regular expression match | function: return true)
      input: user input object, ex: {type: 'text', data: 'Hi'}
    */
    let value: string = ''
    if (prop in input)
      value = input[prop]
    else if (prop == 'text')
      if (input.type == 'text')
        value = input.data
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
        let intent: any = await this.getIntent(input)
        if (intent) {
          input.intent = intent.data.result.metadata.intentName;
          input.entities = intent.data.result.parameters;
        }
      } catch (e) {
        return Promise.reject('Error in dialogflow integration')
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
    const BotonicReact = await import('@botonic/react')
    let output = await BotonicReact.renderReactAction(req, a)
    let html = load(output)
    html('[action]').map(({ }, elem) => {
      let e = html(elem)
      e.attr('payload', '__ACTION_PAYLOAD__' + e.attr('action'))
      e.attr('action', null)
    })
    return html.html()
  }

  async getIntent(input: any): Promise<any> {
    if (this.conf.integrations && this.conf.integrations.dialogflow) {
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
