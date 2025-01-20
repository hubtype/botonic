import { WebchatArgs } from '../index-types'

export interface WebchatStateTheme {
  headerTitle: string
  brandColor: string
  brandImage: string
  triggerButtonImage: undefined
  textPlaceholder: string
  style: {
    fontFamily: string
    borderRadius?: string
  }
}

export interface WebchatDevProps extends WebchatArgs {
  initialDevSettings?: {
    keepSessionOnReload?: boolean
    showSessionView?: boolean
  }
}
