import { HtBaseNode } from './common'
import { HtNodeWithContentType } from './node-types'

export interface HtWebviewNode extends HtBaseNode {
  type: HtNodeWithContentType.WEBVIEW
  content: {
    webview_target_id: string
    webview_name: string
  }
}
