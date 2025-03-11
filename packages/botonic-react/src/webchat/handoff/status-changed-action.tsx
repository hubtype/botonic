import { CaseEventStatusChangedInput } from '@botonic/core'
import React from 'react'

import { WebchatSettings } from '../../components/webchat-settings'
import { RequestContext } from '../../contexts'
import { ActionRequest } from '../../index-types'

interface CaseStatusChangedActionProps {
  statusChangedInput: CaseEventStatusChangedInput
}

export class StatusChangedAction extends React.Component<CaseStatusChangedActionProps> {
  static contextType = RequestContext

  static async botonicInit(request: ActionRequest) {
    const input = request.input as unknown as CaseEventStatusChangedInput
    return { statusChangedInput: input }
  }

  render() {
    const { case_id, prev_status, next_status } = this.props.statusChangedInput

    return (
      <WebchatSettings
        handoffState={{
          isHandoff: true,
          caseId: case_id,
          previousStatus: prev_status,
          nextStatus: next_status,
        }}
      />
    )
  }
}
