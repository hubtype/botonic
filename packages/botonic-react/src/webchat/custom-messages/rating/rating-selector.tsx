import React, { useState } from 'react'

import { Smileys } from './smileys'
import { Stars } from './stars'
import { RatingSelectorContainer } from './styles'
import { RatingType } from './types'

interface RatingSelectorProps {
  color: string
  isSent?: boolean
  ratingChange: (newRating: number) => void
  ratingValue: number
  ratingType: RatingType
}

export const RatingSelector = ({
  color,
  isSent,
  ratingChange,
  ratingValue,
  ratingType,
}: RatingSelectorProps) => {
  const [hover, setHover] = useState<number>(-1)

  const onHover = (ratingNumber: number) => {
    if (!isSent) setHover(ratingNumber)
  }

  return (
    <RatingSelectorContainer isSent={isSent}>
      {Array.from({ length: 5 }, (_star, i) => {
        const ratingNumber = i + 1

        return (
          <div
            key={i}
            onMouseEnter={() => onHover(ratingNumber)}
            onMouseLeave={() => onHover(ratingValue)}
            onClick={() => ratingChange(ratingNumber)}
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
