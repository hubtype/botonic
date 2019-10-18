import React from 'react'
import { render } from 'react-dom'

import { Webchat } from './webchat'
import { HubtypeService } from '@botonic/core'
import { msgToBotonic } from './msgToBotonic'

export class WebchatApp {
  constructor({
    theme = {},
    persistentMenu,
    blockInputs,
    emojiPicker,
    defaultDelay,
    defaultTyping,
    onInit,
    onOpen,
    onClose,
    onMessage,
    appId
  }) {
    this.theme = theme
    this.persistentMenu = persistentMenu
    this.blockInputs = blockInputs
    this.emojiPicker = emojiPicker
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
      let lastMessage = messagesJSON[messagesJSON.length - 1]
      this.hubtypeService = new HubtypeService({
        appId: this.appId,
        user,
        lastMessageId: lastMessage && lastMessage.id,
        onEvent: event => this.onServiceEvent(event)
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
      response: msgToBotonic(message, this.theme.customMessageTypes)
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

  getComponent(optionsAtRuntime = {}) {
    let {
      theme = {},
      persistentMenu,
      blockInputs,
      emojiPicker,
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
    emojiPicker = emojiPicker || this.emojiPicker
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
        emojiPicker={emojiPicker}
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
