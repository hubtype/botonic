export enum RatingType {
  Stars = 'stars',
  Smileys = 'smileys',
}

export interface RatingItemProps {
  color: string
  ratingNumber: number
  hover: number
}

export interface RatingIconProps {
  color: string
  selected?: boolean
}
