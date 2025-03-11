import React, { useContext } from 'react'

import { WebchatContext } from '../context'

interface PositionInQueueProps {}

export function HandoffInformationBanner({}: PositionInQueueProps) {
  const { webchatState } = useContext(WebchatContext)

  const handoffState = webchatState.handoffState

  return <div>PositionInQueue: {handoffState.currentQueuePosition}</div>
}
