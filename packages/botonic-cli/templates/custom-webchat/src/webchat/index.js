import launcherIcon from '../assets/launcher-logo.png'
import IntroImage from '../assets/intro-image.jpg'
import C3POLogo from '../assets/c3po-logo.png'
import R2D2Logo from '../assets/r2d2-logo.png'
import CalendarMessage from './calendar-message'
import { CustomTrigger } from './custom-trigger'
import { CustomHeader } from './custom-header'
import { CustomIntro } from './custom-intro'
import { CustomReply } from './custom-reply'
import { CustomButton } from './custom-button'

export const webchat = {
  theme: {
    // GENERAL STYLE OF WEBCHAT
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
      overflow: 'hidden',
      backgroundImage:
        'linear-gradient(to top, #ffffff,#ffffff 11%,#9a9ae3 40%,#0000ff 85%,#0000ff 85%)'
    },
    triggerButtonImage: launcherIcon,
    brandColor: '#0000ff',
    /*
     * brandImage will set both headerImage and botMessageImage with its current logo
     * you can overwrite these values by redefining them individually
     */
    brandImage: R2D2Logo,
    botMessageImage: C3POLogo, // set it to 'null' to hide the botMessageImage
    // headerImage: R2D2Logo, // set it to 'null' to hide the headerImage
    introImage: IntroImage,
    introStyle: {
      padding: 20
    },
    headerTitle: 'My customized webchat',
    headerSubtitle: 'R2D2',
    textPlaceholder: 'Type something...',
    botMessageStyle: {
      border: 'none',
      color: 'blue',
      borderRadius: '20px'
    },
    userMessageStyle: {
      // border:'none',
      color: 'white',
      borderRadius: '10px'
    },
    alignReplies: 'center',
    wrapReplies: 'wrap',
    triggerButtonStyle: {
      width: '200px'
    },

    // CUSTOM MESSAGES
    customMessageTypes: [CalendarMessage],

    // REACT CUSTOMIZABLE COMPONENTS: Remember that these components will overwrite any style for the component they are replacing
    /* Uncomment the other lines to see the rest of React components  */
    // customTrigger: CustomTrigger
    // customHeader: CustomHeader,
    // customIntro: CustomIntro,
    // customButton: CustomButton,
    customReply: CustomReply
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
      match: [/ugly/i, /bastard/i],
      message: 'We cannot tolerate these kind of words.'
    }
  ],

  // Webchat listeners
  onInit: app => {
    // You can combine webchat listeners with the Webchat SDK's Api in order
    // to obtain extra functionalities. This will open automatically the webchat.
    app.open()
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
