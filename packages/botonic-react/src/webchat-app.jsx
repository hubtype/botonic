import React from 'react'
import { render } from 'react-dom'

import { Webchat } from './webchat'
import { HubtypeService } from '@botonic/core'
import { msgToBotonic } from './msg-to-botonic'

export class WebchatApp {
  constructor({
    theme = {},
    persistentMenu,
    blockInputs,
    enableEmojiPicker,
    enableAttachments,
    defaultDelay,
    defaultTyping,
    onInit,
    onOpen,
    onClose,
    onMessage,
    appId,
  }) {
    this.theme = theme
    this.persistentMenu = persistentMenu
    this.blockInputs = blockInputs
    this.enableEmojiPicker = enableEmojiPicker
    this.enableAttachments = enableAttachments
    this.defaultDelay = defaultDelay
    this.defaultTyping = defaultTyping
    this.onInit = onInit
    this.onOpen = onOpen
    this.onClose = onClose
    this.onMessage = onMessage
    this.webchatRef = React.createRef()
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
    this.hubtypeService.postMessage(user, input)
  }

  onStateChange({ user, messagesJSON }) {
    if (!this.hubtypeService && user) {
      const lastMessage = messagesJSON[messagesJSON.length - 1]
      this.hubtypeService = new HubtypeService({
        appId: this.appId,
        user,
        lastMessageId: lastMessage && lastMessage.id,
        onEvent: event => this.onServiceEvent(event),
      })
    }
  }

  onServiceEvent(event) {
    if (event.isError)
      this.webchatRef.current.setError({ message: event.errorMessage })
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
    this.addBotMessage({ type: 'text', data: text })
  }

  addUserMessage(message) {
    this.webchatRef.current.addUserMessage(message)
  }

  addUserText(text) {
    this.webchatRef.current.addUserMessage({ type: 'text', data: text })
  }

  addUserPayload(payload) {
    this.webchatRef.current.addUserMessage({ type: 'postback', payload })
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

  getComponent(optionsAtRuntime = {}) {
    let {
      theme = {},
      persistentMenu,
      blockInputs,
      enableAttachments,
      enableEmojiPicker,
      defaultDelay,
      defaultTyping,
      onInit,
      onOpen,
      onClose,
      onMessage,
      appId,
      ...webchatOptions
    } = optionsAtRuntime
    theme = { ...this.theme, ...theme }
    persistentMenu = persistentMenu || this.persistentMenu
    blockInputs = blockInputs || this.blockInputs
    enableEmojiPicker = enableEmojiPicker || this.enableEmojiPicker
    enableAttachments = enableAttachments || this.enableAttachments
    defaultDelay = defaultDelay || this.defaultDelay
    defaultTyping = defaultTyping || this.defaultTyping
    this.onInit = onInit || this.onInit
    this.onOpen = onOpen || this.onOpen
    this.onClose = onClose || this.onClose
    this.onMessage = onMessage || this.onMessage
    this.appId = appId || this.appId
    return (
      <Webchat
        ref={this.webchatRef}
        {...webchatOptions}
        theme={theme}
        persistentMenu={persistentMenu}
        blockInputs={blockInputs}
        enableEmojiPicker={enableEmojiPicker}
        enableAttachments={enableAttachments}
        defaultDelay={defaultDelay}
        defaultTyping={defaultTyping}
        onInit={(...args) => this.onInitWebchat(...args)}
        onOpen={(...args) => this.onOpenWebchat(...args)}
        onClose={(...args) => this.onCloseWebchat(...args)}
        onUserInput={(...args) => this.onUserInput(...args)}
        onStateChange={webchatState => this.onStateChange(webchatState)}
      />
    )
  }

  render(dest, optionsAtRuntime = {}) {
    render(this.getComponent(optionsAtRuntime), dest)
  }
}
