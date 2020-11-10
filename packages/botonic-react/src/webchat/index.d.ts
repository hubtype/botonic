import * as React from 'react'
import { RefObject } from 'react'

import { WebchatApp, WebchatArgs } from '../index'

export interface WebchatProps extends WebchatArgs {
  ref: RefObject<any>
  resendUnsentInputs?: () => Promise<void>
}
export const WebChat: React.ForwardRefExoticComponent<WebchatProps>

export interface WebchatDevProps extends WebchatProps {
  initialDevSettings?: {
    keepSessionOnReload?: boolean
    showSessionView?: boolean
  }
}
export const WebChatDev: React.ForwardRefExoticComponent<WebchatDevProps>

export function getBotonicApp(): WebchatApp
