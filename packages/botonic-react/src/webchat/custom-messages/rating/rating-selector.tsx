/** biome-ignore-all lint/a11y/noStaticElementInteractions: we need to use static elements for the rating selector */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: we need to use key with click events for the rating selector */
import { useState } from 'react'

import { Smileys } from './smileys'
import { Stars } from './stars'
import { RatingSelectorContainer } from './styles'
import { RatingType } from './types'

const NUMBER_OF_RATING_BUTTONS = 5
interface RatingSelectorProps {
  color: string
  isSent?: boolean
  onRatingChange: (newRating: number) => void
  ratingValue: number
  ratingType: RatingType
  valueSent?: number
}

export const RatingSelector = ({
  color,
  isSent,
  onRatingChange,
  ratingValue,
  ratingType,
  valueSent,
}: RatingSelectorProps) => {
  const [hover, setHover] = useState<number>(valueSent ? valueSent : -1)

  const onHover = (ratingNumber: number) => {
    if (!valueSent) {
      setHover(ratingNumber)
    }
  }

  return (
    <RatingSelectorContainer isSent={isSent}>
      {Array.from({ length: NUMBER_OF_RATING_BUTTONS }, (_star, i) => {
        const ratingNumber = i + 1

        return (
          <div
            key={ratingNumber}
            onMouseEnter={() => onHover(ratingNumber)}
            onMouseLeave={() => onHover(ratingValue)}
            onClick={() => onRatingChange(ratingNumber)}
          >
            {ratingType === RatingType.Stars && (
              <Stars color={color} ratingNumber={ratingNumber} hover={hover} />
            )}
            {ratingType === RatingType.Smileys && (
              <Smileys
                color={color}
                ratingNumber={ratingNumber}
                hover={hover}
              />
            )}
          </div>
        )
      })}
    </RatingSelectorContainer>
  )
}
