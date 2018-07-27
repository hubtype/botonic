export { run } from '@oclif/command'
import { Component }  from './react/component'

var MessageTemplate = require('../lib/react/server/bundles/pages/messageTemplate').default
var ShareButton = require('../lib/react/server/bundles/pages/shareButton').default

export const Botonic: object = {
  React: {Component},
  MessageTemplate,
  ShareButton
}

export { default as i18n , lang} from './i18n'
