import { ContentFieldsBase } from './content-fields-base'
import { HtWebviewExits, HtWebviewNode } from './hubtype-fields'

export class FlowWebview extends ContentFieldsBase {
  public code: string = ''
  public webviewTargetId: string = ''
  public webviewName: string = ''
  public webviewComponentName: string = ''
  public exits: HtWebviewExits[] = []

  static fromHubtypeCMS(component: HtWebviewNode): FlowWebview {
    const newWebview = new FlowWebview(component.id)
    newWebview.webviewTargetId = component.content.webview_target_id
    newWebview.webviewName = component.content.webview_name
    newWebview.webviewComponentName = component.content.webview_component_name
    newWebview.exits = component.content.exits

    return newWebview
  }
}
