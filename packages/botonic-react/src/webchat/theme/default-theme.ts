import { COLORS, WEBCHAT } from '../../constants'
import { WebchatTheme } from './types'

export const defaultTheme: WebchatTheme = {
  style: {
    width: '300px',
    height: '450px',
    borderRadius: '10px',
    fontFamily: "'Noto Sans JP', sans-serif",
    fontSize: '16px',
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    backgroundColor: COLORS.SOLID_WHITE,
    boxShadow: `${COLORS.SOLID_BLACK_ALPHA_0_2} 0px 0px 12px`,
  },
  mobileBreakpoint: 768,
  mobileStyle: {
    width: '100%',
    height: '100%',
    borderRadius: '0px',
    fontSize: '16px',
    position: 'absolute',
    right: '0px',
    bottom: '0px',
  },
  header: {
    title: 'Botonic',
    subtitle: '',
    image: WEBCHAT.DEFAULTS.LOGO,
    style: {
      borderRadius: '10px 10px 0px 0px',
    },
    mobileStyle: {
      borderRadius: '0px',
    },
  },
  brand: {
    color: COLORS.BOTONIC_BLUE,
    image: WEBCHAT.DEFAULTS.LOGO,
  },
  button: {
    autodisable: false,
    disabledstyle: {
      opacity: 0.5,
      cursor: 'auto',
      pointerEvents: 'none',
    },
    messageType: 'text',
  },
  message: {
    user: {
      blobTick: true,
    },
    bot: {
      blobTick: true,
    },
  },
  triggerButton: { image: WEBCHAT.DEFAULTS.LOGO },
  userInput: {
    attachments: { enable: false },
    box: {
      placeholder: 'Ask me something...',
    },
    emojiPicker: { enable: false },
    sendButton: { enable: true },
    enable: true,
  },
  carousel: {
    enableArrows: true,
  },
  animations: { enable: true },
  notifications: {
    enable: false,
    banner: {
      enable: false,
      text: 'unread messages',
    },
    triggerButton: { enable: false },
  },
}
