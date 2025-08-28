import { ContentFieldsBase } from './content-fields-base'
import { HtWebviewNode } from './hubtype-fields'

export class FlowWebview extends ContentFieldsBase {
  public code: string = ''
  public webviewTargetId: string = ''
  public webviewName: string = ''

  static fromHubtypeCMS(component: HtWebviewNode): FlowWebview {
    const newWebview = new FlowWebview(component.id)
    newWebview.webviewTargetId = component.content.webview_target_id
    newWebview.webviewName = component.content.webview_name

    return newWebview
  }
}
