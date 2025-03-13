import { CASE_STATUS } from '@botonic/core'
import React, { useContext } from 'react'

import { WebchatContext } from '../context'
import { BannerContainer, BannerText, BannerTextStrong } from './styles'

interface HandoffInformationBannerProps {}

export function HandoffInformationBanner({}: HandoffInformationBannerProps) {
  const { webchatState } = useContext(WebchatContext)

  const handoffState = webchatState.handoffState

  console.log('handoffState', handoffState)

  const showPositionInQueueText = () => {
    if (handoffState.currentQueuePosition === null || 0) {
      return null
    }

    return (
      <BannerText>
        Position in queue{' '}
        <BannerTextStrong>{handoffState.currentQueuePosition}</BannerTextStrong>
      </BannerText>
    )
  }

  const showAgentStatusText = () => {
    if (handoffState.nextStatus === CASE_STATUS.ATTENDING) {
      return <BannerText>An agent has joined the conversation</BannerText>
    }

    if (handoffState.previousStatus === CASE_STATUS.ATTENDING) {
      return <BannerText>Chat with agent has ended</BannerText>
    }
    return null
  }

  return (
    <BannerContainer>
      {showPositionInQueueText()}
      {showAgentStatusText()}
    </BannerContainer>
  )
}
