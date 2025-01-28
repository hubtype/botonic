import './styles.scss'

import { WebchatApp, WebchatArgs, WebchatMessage } from '@botonic/react'

import { FORCED_PAYLOAD } from '../../server/constants'
import { getLocalContents } from '../../shared/locales'
import AgentAvatar from '../assets/agent-avatar.svg'
import BotAvatar from '../assets/bot-avatar.svg'
import { CustomHeader } from './custom-header'
import { AttachmentsButton } from './custom-input-user/attachments-button'
import { EmojiPickerButton } from './custom-input-user/emoji-picker-button'
import { SendButton } from './custom-input-user/send-button'
import { DefaultTriggerButton } from './trigger-button/default'

declare global {
  interface Window {
    botonicOnInit: (app: WebchatApp) => void
    botonicOnOpen: (app: WebchatApp) => void
    botonicOnClose: (app: WebchatApp) => void
    botonicOnMessage: (app: WebchatApp, message: WebchatMessage) => void
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
window.botonicOnInit = (app: WebchatApp) => {
  return
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
window.botonicOnOpen = (app: WebchatApp) => {
  if (app.getMessages().length === 0) {
    app.addUserPayload(FORCED_PAYLOAD)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
window.botonicOnClose = (app: WebchatApp) => {
  return
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
window.botonicOnMessage = (app: WebchatApp, message: WebchatMessage) => {
  return
}

export const webchat: WebchatArgs = {
  onInit: app => {
    window.botonicOnInit(app)
  },
  onOpen: app => {
    window.botonicOnOpen(app)
  },
  onClose: app => {
    window.botonicOnClose(app)
  },
  onMessage: (app, message) => {
    window.botonicOnMessage(app, message)
  },
  theme: {
    mobileBreakpoint: 650,
    header: {
      custom: CustomHeader,
    },
    triggerButton: {
      custom: DefaultTriggerButton,
    },
    style: {},
    brand: {},
    message: {
      customTypes: [],
      style: {},
      bot: {
        style: {},
        image: BotAvatar,
      },
      user: {
        blobTick: false,
        style: {},
      },
      agent: {
        image: AgentAvatar,
      },
      timestamps: {
        withImage: true,
        format: () => createFormatTimestamp(),
      },
    },
    button: {
      messageType: 'text',
    },
    userInput: {
      box: {
        placeholder: getLocalContents().inputPlaceholder,
      },
      sendButton: {
        custom: SendButton,
      },
      attachments: {
        custom: AttachmentsButton,
      },
      emojiPicker: {
        custom: EmojiPickerButton,
      },
      menu: {
        darkBackground: true,
      },
      blockInputs: [
        {
          match: [/bastard/i],
          message: 'We cannot tolerate these kind of words.',
        },
      ],
    },
  },
}

function createFormatTimestamp() {
  const options: Intl.DateTimeFormatOptions = {
    hourCycle: 'h12',
    hour: 'numeric',
    minute: 'numeric',
  }
  const timestamp = new Date().toLocaleString(undefined, options)
  return timestamp.toLowerCase().replace('. ', '.')
}
