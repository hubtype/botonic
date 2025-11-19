import { EventAction } from '@botonic/core'

import { WindowRestoreSvg } from '../icons/window-restore'

export interface WebviewActionTriggeredDebugEvent {
  action: EventAction.WebviewActionTriggered
  webview_target_id: string
  webview_name: string
}
