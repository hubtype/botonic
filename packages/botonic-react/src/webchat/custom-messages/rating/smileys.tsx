import React from 'react'

import {
  FaceAngrySvg,
  FaceFrownSvg,
  FaceGrinBeamSvg,
  FaceMehSvg,
  FaceSmileSvg,
} from './icons'
import { RatingItemProps } from './types'

export const Smileys = ({ color, ratingNumber, hover }: RatingItemProps) => {
  const isSelected = hover === ratingNumber
  return (
    <>
      {ratingNumber === 1 && (
        <FaceFrownSvg color={color} selected={isSelected} />
      )}
      {ratingNumber === 2 && (
        <FaceAngrySvg color={color} selected={isSelected} />
      )}
      {ratingNumber === 3 && <FaceMehSvg color={color} selected={isSelected} />}
      {ratingNumber === 4 && (
        <FaceSmileSvg color={color} selected={isSelected} />
      )}
      {ratingNumber === 5 && (
        <FaceGrinBeamSvg color={color} selected={isSelected} />
      )}
    </>
  )
}
