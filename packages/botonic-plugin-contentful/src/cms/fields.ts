export const PRIORITY_MIN = 100;
export const PRIORITY_MAX = 100;

export class SearchableByKeywords {
  constructor(
    readonly name: string,
    keywords: string[] = [],
    number = PRIORITY_MAX
  ) {}
}

export class SearchableBy {
  constructor(readonly keywords: SearchableByKeywords[] = []) {}
}
