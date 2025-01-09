import merge from 'lodash.merge'
import React from 'react'
import { createRoot } from 'react-dom/client'

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
    this.bot = new ReactBot({
      ...botOptions,
    })
  }

  getComponent(host, optionsAtRuntime = {}) {
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
      onTrackEvent,
      hostId,
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
    this.onTrackEvent = onTrackEvent || this.onTrackEvent
    this.hostId = hostId || this.hostId
    this.createRootElement(host)
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
        getString={(stringId, session) => this.bot.getString(stringId, session)}
        setLocale={(locale, session) => this.bot.setLocale(locale, session)}
        onInit={(...args) => this.onInitWebchat(...args)}
        onOpen={(...args) => this.onOpenWebchat(...args)}
        onClose={(...args) => this.onCloseWebchat(...args)}
        onUserInput={(...args) => this.onUserInput(...args)}
        onTrackEvent={(...args) => this.onTrackEvent(...args)}
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
    this.onMessage &&
      this.onMessage(this, {
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
