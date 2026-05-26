import { INPUT } from '@botonic/core'
import { createRoot } from 'react-dom/client'

import { DEBUG_SYSTEM_MESSAGES } from './debug-system-messages'
import { SENDERS } from './index-types'
import { ReactBot } from './react-bot'
import { onDOMLoaded } from './util/dom'
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
    contentsByLocale,
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
      contentsByLocale,
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
      contentsByLocale,
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
    this.contentsByLocale = contentsByLocale || this.contentsByLocale
    this.hostId = hostId || this.hostId
    this.createRootElement(host)
    return (
      <WebchatDev
        {...webchatOptions}
        ref={this.webchatRef}
        host={this.host}
        shadowDOM={this.shadowDOM}
        theme={theme}
        storage={storage}
        storageKey={storageKey}
        contentsByLocale={this.contentsByLocale}
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

  /** Pre-built mock payloads for every debug event type. Handy from the console:
   *  Botonic.addDebugSystemMessage(Botonic.debugSystemMessages.aiAgent) */
  get debugSystemMessages() {
    return DEBUG_SYSTEM_MESSAGES
  }

  /**
   * Inject a mock SystemDebugTrace event into the preview webchat.
   * Accepts any DebugEvent payload (plain object with an `action` field).
   *
   * From code:
   *   import { DEBUG_SYSTEM_MESSAGES } from '@botonic/react/src/debug-system-messages'
   *   app.addDebugSystemMessage(DEBUG_SYSTEM_MESSAGES.aiAgent)
   *
   * From the browser console:
   *   Botonic.addDebugSystemMessage(Botonic.debugSystemMessages.conditionalQueueStatus)
   *   Botonic.addDebugSystemMessage({ action: 'nlu_keyword', nlu_keyword_name: 'hi', nlu_keyword_is_regex: false, flow_id: 'f1', flow_node_id: 'n1' })
   */
  addDebugSystemMessage(eventData) {
    this.addSystemMessage({ type: INPUT.SYSTEM_DEBUG_TRACE, data: eventData })
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
