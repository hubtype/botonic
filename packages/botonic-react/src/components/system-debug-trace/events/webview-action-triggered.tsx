import { EventAction } from '@botonic/core'

import { WindowRestoreSvg } from '../icons/window-restore'
import type { DebugEventConfig } from '../types'

export interface WebviewActionTriggeredDebugEvent {
  action: EventAction.WebviewActionTriggered
  webview_target_id: string
  webview_name: string
}

export const getWebviewActionTriggeredEventConfig = (
  data: WebviewActionTriggeredDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      Webview action triggered <span>- {data.webview_name}</span>
    </>
  )

  return {
    action: EventAction.WebviewActionTriggered,
    title,
    component: null,
    icon: <WindowRestoreSvg />,
    collapsible: false,
  }
}
