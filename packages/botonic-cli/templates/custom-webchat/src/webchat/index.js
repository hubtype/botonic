import { MyCustomReply } from './myCustomReply'
import { MyCustomButton } from './myCustomButton'
import { MyCustomHeader } from './myCustomHeader'
import launcherIcon from '../assets/launcher-logo.png'
import { MyCustomIntroImage } from './myCustomIntroImage'
import { MyBotLogoChat } from './myBotLogoChat'
import { MyCustomHeaderImage } from './myCustomHeaderImage'
import { TriggerCustom } from './triggerCustom'
import MyCalendarMessage from './myCalendarMessage'

export const webchat = {
  theme: {
    // WEBCHAT GENERAL STYLING
    style: {
      position: 'fixed',
      right: 20,
      bottom: 20,
      width: 400,
      height: 500,
      margin: 'auto',
      backgroundColor: 'white',
      borderRadius: '25px',
      boxShadow: '0 0 50px rgba(0,0,255,.30)',
      backgroundImage:
        'linear-gradient(to top, #ffffff,#ffffff 11%,#9a9ae3 40%,#0000ff 85%,#0000ff 85%)'
    },
    brandColor: '#0000ff',
    textPlaceholder: 'Type something...',
    botLogoChat: MyBotLogoChat,

    // HEADER STYLING
    headerTitle: 'My customized webchat',
    headerSubtitle: 'R2D2',
    headerImage: MyCustomHeaderImage,
    introImage: MyCustomIntroImage,

    // INTRODUCTORY IMAGE
    introImage: MyCustomIntroImage,

    // MESSAGES STYLING
    customUserMessages: {
      color: 'white',
      borderRadius: '20px'
    },
    customBotMessages: {
      color: 'blue',
      borderRadius: '10px'
    },

    // REPLIES STYLING
    customReply: MyCustomReply,
    alignReplies: 'right',
    wrapReplies: 'wrap',

    // BUTTONS STYLING
    customButton: MyCustomButton,
    brandIconUrl: launcherIcon,

    customMessageTypes: [MyCalendarMessage]

    // FULLY CUSTOMIZABLE COMPONENTS (uncomment below lines to see them in action)
    // customHeader: MyCustomHeader
    // customTriggerButton: TriggerCustom
  },

  // Comment below lines to disable the Persistent Menu
  persistentMenu: [
    { label: 'Help', payload: 'help' },
    {
      label: 'See docs',
      url: 'https://docs.botonic.io'
    }
  ],

  // These are the set of inputs which are not allowed.
  blockInputs: [
    {
      match: [/ugly/, /bastard/],
      message: 'We cannot tolerate these kind of words.'
    }
  ],

  // Webchat listeners
  onInit: app => {
    // You can combine webchat listeners with the Webchat SDK's Api in order
    // to obtain extra functionalities. This will open automatically the webchat.
    app.toggle()
  },
  onOpen: app => {
    // app.addBotText('Hi human!')
    // app.addUserText('Hi bot!')
    app.addUserPayload('POSTBACK_INITCHAT')
  },
  onClose: app => {
    console.log('I have been closed!')
  },
  onMessage: app => {
    console.log('New message!')
  }
}
