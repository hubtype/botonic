import React from 'react'

import { WebchatSettings } from '../../components/webchat-settings'
import { RequestContext } from '../../contexts'
import {
  ActionRequest,
  CaseEventQueuePositionChangedInput,
} from '../../index-types'

interface QueuePositionChangedActionProps {
  queuePositionChangedInput: CaseEventQueuePositionChangedInput
}

export class QueuePositionChangedAction extends React.Component<QueuePositionChangedActionProps> {
  static contextType = RequestContext

  static async botonicInit(request: ActionRequest) {
    const input = request.input as unknown as CaseEventQueuePositionChangedInput
    return { queuePositionChangedInput: input }
  }
  render() {
    const {
      case_id,
      prev_queue_position,
      prev_queue_position_notified_at,
      current_queue_position,
      current_queue_position_notified_at,
      total_queue_waiting_cases_number,
    } = this.props.queuePositionChangedInput

    return (
      <WebchatSettings
        handoffState={{
          isHandoff: true,
          caseId: case_id,
          previousQueuePosition: prev_queue_position,
          previousQueuePositionNotifiedAt: prev_queue_position_notified_at,
          currentQueuePosition: current_queue_position,
          currentQueuePositionNotifiedAt: current_queue_position_notified_at,
          totalWaitingCases: total_queue_waiting_cases_number,
        }}
      />
    )
  }
}
