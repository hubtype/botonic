import { INPUT, InputType } from '@botonic/core'
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
}

const CustomRatingMessage: React.FC<CustomRatingMessageProps> = props => {
  const { payloads, messageText, buttonText, ratingType } = props
  const context = useContext(WebchatContext)

  const theme = useContext(ThemeContext)
  const color = theme?.brand?.color ?? ''

  const [ratingValue, setRatingValue] = useState(-1)
  const [showRating, setShowRating] = useState(true)

  const ratingChanged = (newRating: number) => {
    setRatingValue(newRating)
  }

  const onClickSend = () => {
    if (ratingValue !== -1) {
      setShowRating(false)

      const payload = payloads[ratingValue - 1]

      const input = {
        type: INPUT.POSTBACK as InputType,
        payload,
      }
      void context.sendInput(input)
    }
  }

  const disabled = ratingValue === -1

  return (
    <div className='rating-message-container'>
      <MessageBubble className='rating-message-bubble'>
        {messageText}
        <RatingSelector
          color={color}
          ratingChange={ratingChanged}
          ratingValue={ratingValue}
          ratingType={ratingType}
        />
      </MessageBubble>
      {showRating && (
        <Button autodisable={true} disabled={disabled} onClick={onClickSend}>
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
