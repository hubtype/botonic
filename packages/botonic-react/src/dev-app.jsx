import { createRoot } from 'react-dom/client'

import { SENDERS } from './index-types'
import { ReactBot } from './react-bot'
import { onDOMLoaded } from './util/dom'
import {
  getDefault2SystemMessage,
  getDefaultSystemMessage,
  getDefault3SystemMessage,
} from './util/add-system-message-for-testing'
import { WebchatDev } from './webchat/webchat-dev'
import { WebchatApp } from './webchat-app'

export class DevApp extends WebchatApp {
  constructor({
    theme = {},
    persistentMenu,
    coverComponent,
    blockInputs,
    enableEmojiPicker,
    enableAttachments,
    enableUserInput,
    enableAnimations,
    shadowDOM,
    hostId,
    storage,
    storageKey,
    onInit,
    onOpen,
    onClose,
    onMessage,
    onTrackEvent,
    webviews,
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
      shadowDOM,
      hostId,
      storage,
      storageKey,
      onInit,
      onOpen,
      onClose,
      onMessage,
      onTrackEvent,
    })
    this.webviews = webviews
    this.bot = new ReactBot({
      ...botOptions,
    })
  }

  getComponent(host, optionsAtRuntime = {}) {
    let {
      theme = {},
      storage,
      storageKey,
      onInit,
      onOpen,
      onClose,
      onMessage,
      onTrackEvent,
      hostId,
      ...webchatOptions
    } = optionsAtRuntime
    theme = super.createInitialTheme(optionsAtRuntime)
    storage = storage || this.storage
    storageKey = storageKey || this.storageKey
    this.onInit = onInit || this.onInit
    this.onOpen = onOpen || this.onOpen
    this.onClose = onClose || this.onClose
    this.onMessage = onMessage || this.onMessage
    this.onTrackEvent = onTrackEvent || this.onTrackEvent
    this.hostId = hostId || this.hostId
    this.createRootElement(host)
    // Temporal: expose addSystemMessage for testing system debug trace (e.g. handoff_success)
    if (typeof window !== 'undefined') {
      window.addSystemMessage = option => {
        if (option === 1) {
          this.addSystemMessage(getDefaultSystemMessage())
        } else if (option === 2) {
          this.addSystemMessage(getDefault2SystemMessage())
        } else if (option === 3) {
          this.addSystemMessage(getDefault3SystemMessage())
        }
      }
    }
    return (
      <WebchatDev
        {...webchatOptions}
        ref={this.webchatRef}
        host={this.host}
        shadowDOM={this.shadowDOM}
        theme={theme}
        storage={storage}
        storageKey={storageKey}
        onInit={(...args) => this.onInitWebchat(...args)}
        onOpen={(...args) => this.onOpenWebchat(...args)}
        onClose={(...args) => this.onCloseWebchat(...args)}
        onUserInput={(...args) => this.onUserInput(...args)}
        onTrackEvent={(...args) => this.onTrackEvent(...args)}
        webviews={this.webviews}
      />
    )
  }

  render(dest, optionsAtRuntime = {}) {
    onDOMLoaded(() => {
      const devAppComponent = this.getComponent(dest, optionsAtRuntime)
      const container = this.getReactMountNode(dest)
      const reactRoot = createRoot(container)
      reactRoot.render(devAppComponent)
    })
  }

  async onUserInput({ input, session, lastRoutePath }) {
    this.onMessage?.(this, {
      sentBy: SENDERS.user,
      message: input,
    })
    const resp = await this.bot.input({ input, session, lastRoutePath })
    this.onMessage &&
      resp.response.map(r =>
        this.onMessage(this, {
          sentBy: SENDERS.bot,
          message: r,
        })
      )
    this.webchatRef.current.addBotResponse(resp)
  }
}
