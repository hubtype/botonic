import React, { useContext, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

import ThumbsDown from '../../assets/thumbs-down.svg'
import ThumbsUp from '../../assets/thumbs-up.svg'
import { RequestContext, WebchatContext } from '../../contexts'
import { ActionRequest } from '../../index-types'
import { resolveImage } from '../../util'
import { EventAction, FeedbackOption } from '../../webchat/tracking'
import { FeedbackButton, FeedbackMessageContainer } from './styles'

interface ButtonsState {
  positive: boolean
  negative: boolean
}

interface RatingProps {
  inferenceId?: string
  messageId: string
}

export const MessageFeedback = ({ inferenceId, messageId }: RatingProps) => {
  const { webchatState, updateMessage, trackEvent } = useContext(WebchatContext)
  const request = useContext(RequestContext)

  const [className, setClassName] = useState('')
  const [disabled, setDisabled] = useState<ButtonsState>({
    positive: false,
    negative: false,
  })

  const updateMsgWithFeedback = (feedbackEnabled: boolean) => {
    const message = webchatState.messagesJSON.find(
      message => message.id === messageId
    )
    const updatedMsg = {
      ...message,
      feedbackEnabled,
    }
    updateMessage(updatedMsg)
  }

  useEffect(() => {
    updateMsgWithFeedback(true)
  }, [])

  useEffect(() => {
    if (disabled.positive || disabled.negative) {
      setClassName('clicked')
      updateMsgWithFeedback(false)
    }
  }, [disabled])

  const handleClick = async (isUseful: boolean) => {
    if (!trackEvent) {
      return
    }

    if (isUseful) {
      setDisabled({ positive: false, negative: true })
    } else {
      setDisabled({ positive: true, negative: false })
    }

    const args = {
      knowledgebaseInferenceId: inferenceId,
      feedbackTargetId: messageId,
      feedbackGroupId: uuid(),
      possibleOptions: [FeedbackOption.ThumbsUp, FeedbackOption.ThumbsDown],
      possibleValues: [0, 1],
      option: isUseful ? FeedbackOption.ThumbsUp : FeedbackOption.ThumbsDown,
      value: isUseful ? 1 : 0,
    }
    await trackEvent(
      request as ActionRequest,
      EventAction.FeedbackKnowledgebase,
      args
    )
  }

  return (
    <FeedbackMessageContainer>
      <FeedbackButton
        className={className}
        disabled={disabled.positive}
        onClick={() => handleClick(true)}
      >
        <img src={resolveImage(ThumbsUp)} />
      </FeedbackButton>
      <FeedbackButton
        className={className}
        disabled={disabled.negative}
        onClick={() => handleClick(false)}
      >
        <img src={resolveImage(ThumbsDown)} />
      </FeedbackButton>
    </FeedbackMessageContainer>
  )
}
