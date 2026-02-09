import { useContext, useEffect, useState } from 'react'

import ThumbsDown from '../../assets/thumbs-down.svg'
import ThumbsUp from '../../assets/thumbs-up.svg'
import { resolveImage } from '../../util'
import { WebchatContext } from '../../webchat/context'
import { useTracking } from '../../webchat/tracking'
import { FeedbackButton, FeedbackMessageContainer } from './styles'

interface ButtonsState {
  positive: boolean
  negative: boolean
}

interface RatingProps {
  botInteractionId?: string
  inferenceId?: string
  messageId: string
}

export const MessageFeedback = ({
  botInteractionId,
  inferenceId,
  messageId,
}: RatingProps) => {
  const { webchatState, updateMessage } = useContext(WebchatContext)
  const { trackKnowledgebaseFeedback } = useTracking()

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
    if (isUseful) {
      setDisabled({ positive: false, negative: true })
    } else {
      setDisabled({ positive: true, negative: false })
    }

    await trackKnowledgebaseFeedback({
      messageId,
      isUseful,
      botInteractionId,
      inferenceId,
    })
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
