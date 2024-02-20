/**
 * When a search returns multiple results, the one with highest priority should be selected.
 * Eg. content A has keyword 'insurance' and content B has keyword 'travel insurance'.
 * Since the second is more specific, it should have a higher priority
 */
export type Priority = number
export const PRIORITY_MIN: Priority = 0
export const PRIORITY_MAX: Priority = 100

/**
 * The score is how certain we are that the content matches the user input
 */
export type Score = number
export const SCORE_MIN: Score = 0
export const SCORE_MAX: Score = 1

export class SearchableByKeywords {
  constructor(
    readonly name: string,
    public keywords: string[] = [],
    public priority = PRIORITY_MAX
  ) {}
}

export class SearchableBy {
  constructor(readonly keywords: SearchableByKeywords[] = []) {}
}
