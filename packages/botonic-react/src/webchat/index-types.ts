import { WebchatArgs } from '../index-types'

export interface WebchatDevProps extends WebchatArgs {
  initialDevSettings?: {
    keepSessionOnReload?: boolean
    showSessionView?: boolean
  }
}
