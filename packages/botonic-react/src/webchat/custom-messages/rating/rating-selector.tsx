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
  valueSended?: number
}

export const RatingSelector = ({
  color,
  isSent,
  ratingChange,
  ratingValue,
  ratingType,
  valueSended,
}: RatingSelectorProps) => {
  const [hover, setHover] = useState<number>(valueSended ? valueSended : -1)

  const onHover = (ratingNumber: number) => {
    if (!valueSended) setHover(ratingNumber)
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
