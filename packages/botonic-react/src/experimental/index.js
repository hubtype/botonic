import { decode } from 'he'
import merge from 'lodash.merge'
import React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

import { DevApp } from './dev-app'
import { ReactBot } from './react-bot'
import { WebchatDev } from './webchat/webchat-dev'
import { WebchatApp } from './webchat-app'

class WebsocketBackendService {
  constructor({ user, lastMessageId, onEvent }) {
    this.user = user || {}
    this.lastMessageId = lastMessageId
    console.log(onEvent)
    this.onEvent = onEvent
    this.init()
  }
  init(user, lastMessageId) {
    if (user) this.user = user
    if (lastMessageId) this.lastMessageId = lastMessageId
    if (this.wsClient || !this.user.id) return
    // Establish WebSocket Connection
    // eslint-disable-next-line no-undef
    this.wsClient = new ReconnectingWebSocket(WEBSOCKET_URL)

    // On Connection Established...
    this.wsClient.addEventListener('open', event => {})

    // On Event Received...
    this.wsClient.addEventListener('message', event => {
      console.log(event, this.onEvent)
      const message = JSON.parse(decode(event.data))
      if (this.onEvent && typeof this.onEvent === 'function')
        this.onEvent({ message })
    })
  }
  async postMessage(user, message) {
    if (this.wsClient.readyState > 1) this.wsClient.reconnect()
    this.wsClient.send(
      JSON.stringify({
        sender: user,
        message,
      })
    )
  }
}

export class FullstackProdApp extends WebchatApp {
  async onUserInput({ user, input }) {
    this.onMessage && this.onMessage(this, { from: 'user', message: input })
    this.backendService.postMessage(user, input)
  }

  onStateChange({ session: { user }, messagesJSON }) {
    if (!this.backendService && user) {
      const lastMessage = messagesJSON[messagesJSON.length - 1]
      this.backendService = new WebsocketBackendService({
        user,
        lastMessageId: lastMessage && lastMessage.id,
        onEvent: event => this.onServiceEvent(event),
      })
    }
  }
}

export class FullstackDevApp extends DevApp {
  constructor(args) {
    super({ ...args, routes: [] })
    this.playgroundCode = args.playgroundCode
    console.log('FullstackDevApp ', args.playgroundCode)
  }

  async onUserInput({ user, input }) {
    this.onMessage && this.onMessage(this, { from: 'user', message: input })
    this.backendService && this.backendService.postMessage(user, input)
  }

  getComponent(optionsAtRuntime = {}) {
    let {
      theme = {},
      persistentMenu,
      coverComponent,
      blockInputs,
      enableEmojiPicker,
      enableAttachments,
      enableUserInput,
      enableAnimations,
      storage,
      storageKey,
      onInit,
      onOpen,
      onClose,
      onMessage,
      ...webchatOptions
    } = optionsAtRuntime
    theme = merge(this.theme, theme)
    persistentMenu = persistentMenu || this.persistentMenu
    coverComponent = coverComponent || this.coverComponent
    blockInputs = blockInputs || this.blockInputs
    enableEmojiPicker = enableEmojiPicker || this.enableEmojiPicker
    enableAttachments = enableAttachments || this.enableAttachments
    enableUserInput = enableUserInput || this.enableUserInput
    enableAnimations = enableAnimations || this.enableAnimations
    storage = storage || this.storage
    storageKey = storageKey || this.storageKey
    this.onInit = onInit || this.onInit
    this.onOpen = onOpen || this.onOpen
    this.onClose = onClose || this.onClose
    this.onMessage = onMessage || this.onMessage
    return (
      <WebchatDev
        {...webchatOptions}
        ref={this.webchatRef}
        host={this.host}
        shadowDOM={this.shadowDOM}
        theme={theme}
        persistentMenu={persistentMenu}
        coverComponent={coverComponent}
        blockInputs={blockInputs}
        enableEmojiPicker={enableEmojiPicker}
        enableAttachments={enableAttachments}
        enableUserInput={enableUserInput}
        enableAnimations={enableAnimations}
        storage={storage}
        storageKey={storageKey}
        playgroundCode={this.playgroundCode}
        onStateChange={webchatState => this.onStateChange(webchatState)}
        getString={(stringId, session) => this.bot.getString(stringId, session)}
        setLocale={(locale, session) => this.bot.setLocale(locale, session)}
        onInit={(...args) => this.onInitWebchat(...args)}
        onOpen={(...args) => this.onOpenWebchat(...args)}
        onClose={(...args) => this.onCloseWebchat(...args)}
        onUserInput={(...args) => this.onUserInput(...args)}
      />
    )
  }

  onStateChange({ session: { user }, messagesJSON }) {
    if (!this.backendService && user) {
      const lastMessage = messagesJSON[messagesJSON.length - 1]
      this.backendService = new WebsocketBackendService({
        user,
        lastMessageId: lastMessage && lastMessage.id,
        onEvent: event => this.onServiceEvent(event),
      })
    }
  }
}

export class BrowserDevApp extends DevApp {}

export class BrowserProdApp extends WebchatApp {
  constructor({
    theme = {},
    persistentMenu,
    coverComponent,
    blockInputs,
    enableEmojiPicker,
    enableAttachments,
    enableUserInput,
    enableAnimations,
    hostId,
    shadowDOM,
    defaultDelay,
    defaultTyping,
    storage,
    storageKey,
    onInit,
    onOpen,
    onClose,
    onMessage,
    appId,
    visibility,
    ...botOptions
  }) {
    super({
      theme,
      persistentMenu,
      coverComponent,
      blockInputs,
      enableEmojiPicker,
      enableAttachments,
      enableUserInput,
      enableAnimations,
      hostId,
      shadowDOM,
      defaultDelay,
      defaultTyping,
      storage,
      storageKey,
      onInit,
      onOpen,
      onClose,
      onMessage,
      appId,
      visibility,
    })
    this.bot = new ReactBot({
      ...botOptions,
    })
  }
  async onUserInput({ input, session, lastRoutePath }) {
    this.onMessage && this.onMessage(this, { from: 'user', message: input })
    const resp = await this.bot.input({ input, session, lastRoutePath })
    this.onMessage &&
      resp.response.map(r => this.onMessage(this, { from: 'bot', message: r }))
    this.webchatRef.current.addBotResponse(resp)
  }
}

export { BotonicInputTester, BotonicOutputTester } from '../botonic-tester'
export { Button } from '../components/button'
export { Element } from '../components/element'
export { MessageTemplate } from '../components/message-template'
export * from '../components/multichannel'
export { Pic } from '../components/pic'
export { Reply } from '../components/reply'
export { ShareButton } from '../components/share-button'
export { Subtitle } from '../components/subtitle'
export { Title } from '../components/title'
export { WebchatSettings } from '../components/webchat-settings'
export { RequestContext, WebchatContext } from '../contexts'
export { staticAsset } from '../util/environment'
export { getBotonicApp } from '../webchat'
export { WebviewApp } from '../webview'
// Experimental
export { Audio } from './components/audio'
export { Carousel } from './components/carousel'
export { customMessage } from './components/custom-message'
export { Document } from './components/document'
export { Image } from './components/image'
export { Location } from './components/location'
export { Text } from './components/text'
export { Video } from './components/video'
export { WhatsappTemplate } from './components/whatsapp-template'
export { DevApp } from './dev-app'
export { msgsToBotonic, msgToBotonic } from './msg-to-botonic'
export { NodeApp } from './node-app'
export { Webchat } from './webchat/webchat'
export { WebchatApp } from './webchat-app'
