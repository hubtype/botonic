export { run } from '@oclif/command'
import { Component } from './react/component'

import * as React from 'react'
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

import { MessageTemplate } from './react/messageTemplate'
import { ShareButton } from './react/shareButton'

export const Botonic: object = {
  React: { Component },
  MessageTemplate,
  ShareButton
}

export { default as i18n, lang } from './i18n'
