import { EventAction } from '@botonic/core'

import { WindowRestoreSvg } from '../icons/window-restore'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'
import type { DebugEventConfig } from '../types'

export interface WebviewActionTriggeredDebugEvent {
  action: EventAction.WebviewActionTriggered
  webview_target_id: string
  webview_name: string
  webview_params?: Record<string, string>
}

export const WebviewActionTriggered = (
  props: WebviewActionTriggeredDebugEvent
) => {
  return (
    <>
      {Object.keys(props.webview_params ?? {}).length > 0
        ? Object.entries(props.webview_params ?? {}).map(([key, value]) => (
            <StyledDebugDetail key={key}>
              <StyledDebugLabel>{key}</StyledDebugLabel>
              <StyledDebugValue>{value}</StyledDebugValue>
            </StyledDebugDetail>
          ))
        : 'Webview without params'}
    </>
  )
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
    component: WebviewActionTriggered,
    icon: <WindowRestoreSvg />,
    collapsible: true,
  }
}
