import {
  FaceAngrySvg,
  FaceFrownSvg,
  FaceGrinBeamSvg,
  FaceMehSvg,
  FaceSmileSvg,
} from './icons'
import type { RatingItemProps } from './types'

const SMILEY_MAP = {
  1: FaceAngrySvg,
  2: FaceFrownSvg,
  3: FaceMehSvg,
  4: FaceSmileSvg,
  5: FaceGrinBeamSvg,
} as const

export const Smileys = ({ color, ratingNumber, hover }: RatingItemProps) => {
  const isSelected = hover === ratingNumber
  const SmileyComponent = SMILEY_MAP[ratingNumber as keyof typeof SMILEY_MAP]

  return SmileyComponent ? (
    <SmileyComponent color={color} selected={isSelected} />
  ) : null
}
