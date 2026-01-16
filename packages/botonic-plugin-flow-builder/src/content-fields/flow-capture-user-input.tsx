import { ActionRequest } from '@botonic/react'

import { ContentFieldsBase } from './content-fields-base'
import { HtCaptureUserInputNode } from './hubtype-fields/capture-user-input'

export class FlowCaptureUserInput extends ContentFieldsBase {
  public fieldName = ''
  public aiValidationType = 'None'
  public aiValidationInstructions = ''
  public captureSuccessId = ''
  public captureFailId = ''

  static fromHubtypeCMS(cmsText: HtCaptureUserInputNode): FlowCaptureUserInput {
    const newCaptureUserInput = new FlowCaptureUserInput(cmsText.id)
    newCaptureUserInput.code = cmsText.code
    newCaptureUserInput.fieldName = cmsText.content.field_name
    newCaptureUserInput.aiValidationType =
      cmsText.content.ai_validation_type || 'None'
    newCaptureUserInput.aiValidationInstructions =
      cmsText.content.ai_validation_instructions || ''
    newCaptureUserInput.captureSuccessId = cmsText.content.capture_success.id
    newCaptureUserInput.captureFailId = cmsText.content.capture_fail.id
    newCaptureUserInput.followUp = undefined

    return newCaptureUserInput
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async trackFlow(_request: ActionRequest): Promise<void> {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toBotonic(_id: string, request: ActionRequest): JSX.Element {
    request.session.flow_builder = { capture_user_input_id: this.id }

    return <></>
  }
}
