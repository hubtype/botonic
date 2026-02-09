import { StarSvg } from './icons/index'
import type { RatingItemProps } from './types'

export const Stars = ({ color, ratingNumber, hover }: RatingItemProps) => {
  const isSelected = hover >= ratingNumber
  return <StarSvg color={color} selected={isSelected} />
}
