import React, { createRef } from 'react'
import { render } from 'react-dom'

import { Webchat } from './webchat'
import { HubtypeService, INPUT } from '@botonic/core'
import { msgToBotonic } from './msg-to-botonic'
import merge from 'lodash.merge'

export class WebchatApp {
  constructor({
    theme = {},
    persistentMenu,
    coverComponent,
    blockInputs,
    enableEmojiPicker,
    enableAttachments,
    enableUserInput,
    enableAnimations,
    defaultDelay,
    defaultTyping,
    onInit,
    onOpen,
    onClose,
    onMessage,
    appId,
    visibility,
  }) {
    this.theme = theme
    this.persistentMenu = persistentMenu
    this.coverComponent = coverComponent
    this.blockInputs = blockInputs
    this.enableEmojiPicker = enableEmojiPicker
    this.enableAttachments = enableAttachments
    this.enableUserInput = enableUserInput
    this.enableAnimations = enableAnimations
    this.defaultDelay = defaultDelay
    this.defaultTyping = defaultTyping
    this.onInit = onInit
    this.onOpen = onOpen
    this.onClose = onClose
    this.onMessage = onMessage
    this.visibility = visibility
    this.webchatRef = createRef()
    this.appId = appId
  }

  onInitWebchat(...args) {
    this.onInit && this.onInit(this, ...args)
  }

  onOpenWebchat(...args) {
    this.onOpen && this.onOpen(this, ...args)
  }

  onCloseWebchat(...args) {
    this.onClose && this.onClose(this, ...args)
  }

  async onUserInput({ user, input }) {
    this.onMessage && this.onMessage(this, { from: 'user', message: input })
    return this.hubtypeService.postMessage(user, input)
  }

  async resendUnsentInputs() {
    return this.hubtypeService.resendUnsentInputs()
  }

  onStateChange({ user, messagesJSON }) {
    if (!this.hubtypeService && user) {
      const lastMessage = messagesJSON[messagesJSON.length - 1]
      this.hubtypeService = new HubtypeService({
        appId: this.appId,
        user,
        lastMessageId: lastMessage && lastMessage.id,
        lastMessageUpdateDate: this.getLastMessageUpdate(),
        onEvent: event => this.onServiceEvent(event),
        unsentInputs: () =>
          this.webchatRef.current.getMessages().filter(msg => msg.ack === 0),
      })
    }
  }

  onServiceEvent(event) {
    if (event.isError)
      this.webchatRef.current.setError({ message: event.errorMessage })
    else if (event.action === 'update_message_info')
      this.updateMessageInfo(event.message.id, event.message)
    else if (event.message.type === 'update_webchat_settings')
      this.updateWebchatSettings(event.message.data)
    else if (event.message.type === 'sender_action')
      this.setTyping(event.message.data === 'typing_on')
    else this.addBotMessage(event.message)
  }

  updateUser(user) {
    this.webchatRef.current.updateUser(user)
  }

  addBotMessage(message) {
    this.webchatRef.current.addBotResponse({
      response: msgToBotonic(
        message,
        (this.theme.message && this.theme.message.customTypes) ||
          this.theme.customMessageTypes
      ),
    })
  }

  addBotText(text) {
    this.addBotMessage({ type: INPUT.TEXT, data: text })
  }

  addUserMessage(message) {
    this.webchatRef.current.addUserMessage(message)
  }

  addUserText(text) {
    this.webchatRef.current.addUserMessage({ type: INPUT.TEXT, data: text })
  }

  addUserPayload(payload) {
    this.webchatRef.current.addUserMessage({ type: INPUT.POSTBACK, payload })
  }

  setTyping(typing) {
    this.webchatRef.current.setTyping(typing)
  }

  open() {
    this.webchatRef.current.openWebchat()
  }

  close() {
    this.webchatRef.current.closeWebchat()
  }

  toggle() {
    this.webchatRef.current.toggleWebchat()
  }

  getMessages() {
    return this.webchatRef.current.getMessages()
  }

  clearMessages() {
    this.webchatRef.current.clearMessages()
  }

  async getVisibility() {
    return this.resolveWebchatVisibility({
      appId: this.appId,
      visibility: this.visibility,
    })
  }

  getLastMessageUpdate() {
    return this.webchatRef.current.getLastMessageUpdate()
  }

  updateMessageInfo(msgId, messageInfo) {
    return this.webchatRef.current.updateMessageInfo(msgId, messageInfo)
  }

  updateWebchatSettings(settings) {
    return this.webchatRef.current.updateWebchatSettings(settings)
  }

  getComponent(optionsAtRuntime = {}) {
    let {
      theme = {},
      persistentMenu,
      coverComponent,
      blockInputs,
      enableAttachments,
      enableUserInput,
      enableAnimations,
      enableEmojiPicker,
      defaultDelay,
      defaultTyping,
      onInit,
      onOpen,
      onClose,
      onMessage,
      appId,
      visibility,
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
    defaultDelay = defaultDelay || this.defaultDelay
    defaultTyping = defaultTyping || this.defaultTyping
    this.onInit = onInit || this.onInit
    this.onOpen = onOpen || this.onOpen
    this.onClose = onClose || this.onClose
    this.onMessage = onMessage || this.onMessage
    this.visibility = visibility || this.visibility
    this.appId = appId || this.appId
    return (
      <Webchat
        ref={this.webchatRef}
        {...webchatOptions}
        theme={theme}
        persistentMenu={persistentMenu}
        coverComponent={coverComponent}
        blockInputs={blockInputs}
        enableEmojiPicker={enableEmojiPicker}
        enableAttachments={enableAttachments}
        enableUserInput={enableUserInput}
        enableAnimations={enableAnimations}
        defaultDelay={defaultDelay}
        defaultTyping={defaultTyping}
        onInit={(...args) => this.onInitWebchat(...args)}
        onOpen={(...args) => this.onOpenWebchat(...args)}
        onClose={(...args) => this.onCloseWebchat(...args)}
        onUserInput={(...args) => this.onUserInput(...args)}
        onStateChange={webchatState => this.onStateChange(webchatState)}
        resendUnsentInputs={() =>
          this.hubtypeService && this.hubtypeService.resendUnsentInputs()
        }
      />
    )
  }

  async isWebchatVisible({ appId }) {
    try {
      const { status } = await HubtypeService.getWebchatVisibility({
        appId,
      })
      return status === 200
    } catch (e) {
      return false
    }
  }

  async resolveWebchatVisibility(optionsAtRuntime) {
    let { appId, visibility } = optionsAtRuntime
    visibility = visibility || this.visibility
    if (visibility === undefined || visibility === true) return true
    if (typeof visibility === 'function' && visibility()) return true
    if (visibility === 'dynamic' && (await this.isWebchatVisible({ appId })))
      return true
    return false
  }

  async render(dest, optionsAtRuntime = {}) {
    const isVisible = await this.resolveWebchatVisibility(optionsAtRuntime)
    if (isVisible) render(this.getComponent(optionsAtRuntime), dest)
    return null
  }
}
