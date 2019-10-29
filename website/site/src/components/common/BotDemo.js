import React from 'react'
import { WebchatApp } from '@botonic/react'

let app = new WebchatApp({
  appId: '959e282d-3e03-4469-bec9-0d42d4d0662e',
  theme: {
    style: {
      position: 'relative',
      background: '#43495F'
    },
    botMessageStyle: {
      fontFamily: 'Noto Sans JP',
      background: '#FFFFFF',
      lineHeight: '26px',
      fontSize: '18 spx',
      borderRadius: '26px',
      border: '1px solid white'
    },
    userMessageStyle: {
      fontFamily: 'Noto Sans JP',
      background: 'rgb(0, 153, 255)',
      border: '1px solid rgb(0, 153, 255)',
      lineHeight: '26px',
      fontSize: '18 spx',
      borderRadius: '26px'
    },
    textAreaStyle: {
      lineHeight: '26px',
      borderRadius: '26px'
    },
    customHeader: () => <div></div>,
    triggerButtonImage: null
  },
  persistentMenu: null,
  emojiPicker: true,
  defaultDelay: 1,
  defaultTyping: 1,
  onInit: () => {
    app.open()
    app.addBotMessage({ type: 'text', data: 'Welcome to Botonic!' })
    app.addUserMessage({ type: 'text', data: 'start' })
  }
})

const BotDemo = React.memo(({ onMessageSent }) => {
  return app.getComponent({
    onMessage: (app, message) => {
      console.log(message)
      onMessageSent(message.message.data)
    }
  })
})
export default BotDemo
