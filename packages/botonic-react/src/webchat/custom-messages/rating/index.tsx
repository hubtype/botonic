import { INPUT, InputType } from '@botonic/core'
import merge from 'lodash.merge'
import React, { useContext, useState } from 'react'
import { ThemeContext } from 'styled-components'

import { Button, customMessage } from '../../../components'
import { WebchatContext } from '../../context'
import { RatingSelector } from './rating-selector'
import { MessageBubble } from './styles'
import { RatingType } from './types'

interface CustomRatingMessageProps {
  payloads: string[]
  messageText: string
  buttonText: string
  ratingType: RatingType
  json: { messageId?: string; valueSent?: number }
}

const CustomRatingMessage: React.FC<CustomRatingMessageProps> = props => {
  const { payloads, messageText, buttonText, ratingType } = props
  const { webchatState, updateMessage, sendInput } = useContext(WebchatContext)

  const theme = useContext(ThemeContext)
  const color = theme?.brand?.color ?? ''

  const [ratingValue, setRatingValue] = useState(
    props.json?.valueSent ? props.json.valueSent : -1
  )
  const [showRating, setShowRating] = useState(true)

  const ratingChanged = (newRating: number) => {
    setRatingValue(newRating)
  }

  const updateMessageJSON = (messageId?: string) => {
    if (messageId) {
      const messageToUpdate = webchatState.messagesJSON.filter(m => {
        return m.id === messageId
      })[0]
      const messageInfo = {
        data: {
          json: {
            valueSent: ratingValue,
          },
        },
      }
      const updatedMsg = merge(messageToUpdate, messageInfo)
      updateMessage(updatedMsg)
    }
  }

  const handleButtonSend = () => {
    if (ratingValue !== -1) {
      setShowRating(false)

      const payload = payloads[ratingValue - 1]

      updateMessageJSON(props.json?.messageId)

      const input = {
        type: INPUT.POSTBACK as InputType,
        payload,
      }
      void sendInput(input)
    }
  }

  const disabled = ratingValue === -1

  return (
    <div className='rating-message-container'>
      <MessageBubble className='rating-message-bubble'>
        {messageText}
        <RatingSelector
          color={color}
          onRatingChange={ratingChanged}
          ratingValue={ratingValue}
          ratingType={ratingType}
          valueSent={props.json?.valueSent}
        />
      </MessageBubble>
      {!props.json?.valueSent && showRating && (
        <Button
          autodisable={true}
          disabled={disabled}
          onClick={handleButtonSend}
        >
          {buttonText}
        </Button>
      )}
    </div>
  )
}

export default customMessage({
  name: 'custom-rating',
  component: CustomRatingMessage,
})
