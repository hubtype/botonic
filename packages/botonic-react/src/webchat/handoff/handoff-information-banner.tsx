import { CASE_STATUS } from '@botonic/core'
import React, { useContext } from 'react'

import { WebchatContext } from '../context'
import { BannerContainer, BannerText, BannerTextStrong } from './styles'

interface HandoffInformationBannerProps {}

export function HandoffInformationBanner({}: HandoffInformationBannerProps) {
  const { webchatState } = useContext(WebchatContext)

  const handoffState = webchatState.handoffState

  console.log('handoffState', handoffState)

  if (
    handoffState.previousStatus === CASE_STATUS.WAITING &&
    handoffState.nextStatus === CASE_STATUS.ATTENDING
  ) {
    return (
      <BannerContainer>
        <BannerText>An agent has joined the conversation</BannerText>
      </BannerContainer>
    )
  }

  if (handoffState.previousStatus === CASE_STATUS.ATTENDING) {
    return (
      <BannerContainer>
        <BannerText>Chat with agent has ended</BannerText>
      </BannerContainer>
    )
  }

  return (
    <BannerContainer>
      <BannerText>
        Position in queue{' '}
        <BannerTextStrong>{handoffState.currentQueuePosition}</BannerTextStrong>
      </BannerText>
    </BannerContainer>
  )
}
