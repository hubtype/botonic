import { DevApp, NodeApp, WebchatApp, WebviewApp } from '@botonic/react'
import {
  routes,
  locales,
  theme,
  webviews,
  onInit,
  onOpen,
  onClose,
  onMessage
} from 'BotonicProject'

export let app

if (process.env.BOTONIC_TARGET === 'dev') {
  app = new DevApp({
    routes,
    locales,
    theme,
    onMessage,
    onInit,
    onOpen,
    onClose
  })
} else if (process.env.BOTONIC_TARGET === 'node') {
  app = new NodeApp({ routes, locales })
} else if (process.env.BOTONIC_TARGET === 'webchat') {
  app = new WebchatApp({ theme, onMessage, onInit, onOpen, onClose })
} else if (process.env.BOTONIC_TARGET === 'webviews') {
  app = new WebviewApp({ webviews, locales })
}
