import type { HtBaseNode, HtNodeLink } from './common'
import type { HtNodeWithContentType } from './node-types'

export interface HtWebviewExits {
  id: string
  name: string
  target?: HtNodeLink
}

export interface HtWebviewNode extends HtBaseNode {
  type: HtNodeWithContentType.WEBVIEW
  content: {
    webview_target_id: string
    webview_name: string
    webview_component_name: string
    exits: HtWebviewExits[]
  }
}
