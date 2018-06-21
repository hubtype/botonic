export { run } from '@oclif/command'
import { Component }  from './react/component'
//import { Webview } from './react/webview'
//import BotonicWebview from '../lib/react/dist/bundles/pages/webview'

const BotonicWebview = require('../lib/react/dist/bundles/pages/webview').default

export const Botonic: object = {
  React: {Component},
  Webview: {BotonicWebview}
}

export { default as i18n , lang} from './i18n'
//var webview = require('../lib/react/dist/bundles/pages/webview')
//const BotonicWebview = require('../lib/react/dist/bundles/pages/webview').default
//export const BotonicWebview
