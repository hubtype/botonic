import C3POLogo from '../assets/c3po-logo.png'
import IntroImage from '../assets/intro-image.jpg'
import launcherIcon from '../assets/launcher-logo.png'
import R2D2Logo from '../assets/r2d2-logo.png'
import CalendarMessage from './calendar-message'
import { CustomButton } from './custom-button'
import { CustomHeader } from './custom-header'
import { CustomIntro } from './custom-intro'
import { CustomReply } from './custom-reply'
import { CustomTrigger } from './custom-trigger'

export const webchat = {
  theme: {
    mobileBreakpoint: 460,
    style: {
      position: 'fixed',
      right: 20,
      bottom: 20,
      width: 400,
      height: 500,
      margin: 'auto',
      backgroundColor: 'white',
      borderRadius: 25,
      boxShadow: '0 0 50px rgba(0,0,255,.30)',
      overflow: 'hidden',
      backgroundImage:
        'linear-gradient(to top, #ffffff,#ffffff 11%,#9a9ae3 40%,#0000ff 85%,#0000ff 85%)',
      fontFamily: '"Comic Sans MS", cursive, sans-serif',
    },
    webview: {
      style: {
        top: 0,
        right: 0,
        height: 500,
        width: '100%',
      },
      header: {
        style: {
          background: '#6677FF',
        },
      },
    },

    brand: {
      // color: 'blue',
      image: R2D2Logo,
    },
    triggerButton: {
      image: launcherIcon,
      style: {
        width: '200px',
      },
      // custom: CustomTrigger,
    },
    intro: {
      // image: IntroImage,
      // style: {
      //   padding: 20
      // }
      custom: CustomIntro,
    },
    header: {
      title: 'My customized webchat',
      subtitle: 'R2D2',
      image: R2D2Logo,
      style: {
        height: 70,
      },
      // custom: CustomHeader
    },
    /*
     * brandImage will set both headerImage and botMessageImage with its current logo
     * you can overwrite these values by redefining them individually
     */
    message: {
      bot: {
        image: C3POLogo, // set it to 'null' to hide this image
        style: {
          border: 'none',
          color: 'black',
          borderRadius: '20px',
          background: '#e1fcfb',
        },
      },
      user: {
        style: {
          // border:'none',
          color: 'white',
          background: '#2b81b6',
          borderRadius: '10px',
        },
      },
      customTypes: [CalendarMessage],
    },

    button: {
      style: {
        color: 'black',
        background: 'white',
        borderRadius: 20,
      },
      hoverBackground: '#b3fcfa',
      hoverTextColor: 'black',

      // custom: CustomButton,
    },
    replies: {
      align: 'center',
      wrap: 'nowrap',
    },
    reply: {
      style: {
        color: 'black',
        background: '#e1fcfb',
        borderColor: 'black',
      },
      // custom: CustomReply,
    },
    userInput: {
      style: {
        background: 'black',
      },
      box: {
        style: {
          border: '2px solid #2b81b6',
          color: '#2b81b6',
          background: '#F0F0F0',
          width: '90%',
          borderRadius: 20,
          paddingLeft: 20,
          marginRight: 10,
        },
        placeholder: 'Type something...',
      },

      // enable: false,
      attachments: {
        enable: true,
      },

      emojiPicker: true,
      // These are the set of inputs which are not allowed.
      blockInputs: [
        {
          match: [/ugly/i, /bastard/i],
          message: 'We cannot tolerate these kind of words.',
        },
      ],
      persistentMenu: [
        { label: 'Help', payload: 'help' },
        {
          label: 'See docs',
          url: 'https://botonic.io/docs/welcome/',
        },
        { closeLabel: 'Close' },
      ],
    },
    scrollbar: {
      // enable: false,
      autoHide: true,
      thumb: {
        opacity: 1,
        // color: 'yellow',
        bgcolor:
          'linear-gradient(-131deg,rgba(231, 176, 43) 0%,rgb(193, 62, 81) 100%);',
        border: '20px',
      },
      // track: {
      //   color: 'black',
      //   bgcolor:
      //     'linear-gradient(-131deg,rgba(50, 40, 43) 0%,rgb(125, 62, 81) 100%);',
      //   border: '20px',
      // },
    },
  },

  // Webchat listeners
  onInit: app => {
    // You can combine webchat listeners with the Webchat SDK's Api in order
    // to obtain extra functionalities. This will open automatically the webchat.
    app.open()
  },
  onOpen: app => {
    // app.addBotText('Hi human!')
    // app.addUserText('Hi bot!')
    // app.addUserPayload('POSTBACK_INITCHAT')
  },
  onClose: app => {
    console.log('I have been closed!')
  },
  onMessage: app => {
    console.log('New message!')
  },
}
