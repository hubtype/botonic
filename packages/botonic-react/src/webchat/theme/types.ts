import {
  BlockInputOption,
  ButtonProps,
  CustomMessageType,
} from '../../components/index-types'

export interface ImagePreviewerProps {
  src: string
  isPreviewerOpened: boolean
  closePreviewer: () => void
}
export interface CoverComponentProps {
  closeComponent: () => void
}

export interface CoverComponentOptions {
  component: React.ComponentType<CoverComponentProps>
  props?: any
}

export type PersistentMenuCloseOption = { closeLabel: string }
export type PersistentMenuOption = { label: string } & ButtonProps

export type PersistentMenuOptionsTheme = (
  | PersistentMenuCloseOption
  | PersistentMenuOption
)[]

export interface PersistentMenuOptionsProps {
  onClick: () => void
  options: any
}

export interface BlobProps {
  blobTick?: boolean
  blobTickStyle?: any
  blobWidth?: string
  imageStyle?: any
}

export interface WebchatTheme {
  style: {
    width?: string
    height?: string
    borderRadius?: string
    fontFamily?: string
    fontSize?: string
    position?: 'fixed' | 'absolute'
    right?: string
    bottom?: string
    backgroundColor?: string
    boxShadow?: string
  }
  mobileBreakpoint: number
  mobileStyle: {
    width?: string
    height?: string
    borderRadius?: string
    fontSize?: string
    position?: 'fixed' | 'absolute'
    right?: string
    bottom?: string
  }

  coverComponent?: CoverComponentOptions
  webview?: {
    style?: any
    header?: {
      style?: any
    }
  }
  animations?: { enable?: boolean }
  intro?: {
    style?: any
    image?: string
    custom?: React.ComponentType
  }
  brand?: { color?: string; image?: string }
  header?: {
    title?: string
    subtitle?: string
    image?: string
    style?: {
      borderRadius?: string
    }
    mobileStyle?: {
      borderRadius?: string
    }
    custom?: React.ComponentType
  }
  message?: {
    bot?: BlobProps & { image?: string; style?: any }
    agent?: { image?: string }
    user?: BlobProps & { style?: any }
    // TODO: Review type used in customTypes should be a component exported by default with customMessage function
    customTypes?: CustomMessageType[]
    style?: any
    timestamps?: {
      withImage?: boolean
      format: () => string
      style?: any
      enable?: boolean
    }
  }
  button?: {
    autodisable?: boolean
    disabledstyle?: any
    hoverBackground?: string
    hoverTextColor?: string
    messageType?: 'text' | 'payload'
    urlIcon?: {
      image?: string
      enable?: boolean
    }
    style?: any
    custom?: React.ComponentType
  }
  replies?: {
    align?: 'left' | 'center' | 'right'
    wrap?: 'wrap' | 'nowrap'
  }
  carousel?: {
    arrow?: {
      left: { custom?: React.ComponentType }
      right: { custom?: React.ComponentType }
    }
    enableArrows?: boolean
  }
  reply?: {
    style?: any
    custom?: React.ComponentType
  }
  triggerButton: {
    image?: string
    style?: any
    custom?: React.ComponentType
  }
  notifications?: {
    enable?: boolean
    banner?: {
      custom?: React.ComponentType
      enable?: boolean
      text?: string
    }
    triggerButton?: { enable?: boolean }
  }
  scrollButton?: {
    enable?: boolean
    custom?: React.ComponentType
  }
  markdownStyle?: string // string template with css styles
  userInput?: {
    attachments?: {
      enable?: boolean
      custom?: React.ComponentType
    }
    blockInputs?: BlockInputOption[]
    box?: {
      placeholder: string
      style?: any
    }
    emojiPicker?: {
      enable?: boolean
      custom?: React.ComponentType
    }
    menu?: {
      darkBackground?: boolean
      custom?: React.ComponentType<PersistentMenuOptionsProps>
    }
    menuButton?: { custom?: React.ComponentType }
    persistentMenu?: PersistentMenuOptionsTheme
    sendButton?: {
      enable?: boolean
      custom?: React.ComponentType
    }
    enable?: boolean
    style?: any
  }
  imagePreviewer?: React.ComponentType<ImagePreviewerProps>
}
