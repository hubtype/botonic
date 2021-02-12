export type Augmenter = { [keyword: string]: string[] }
export type Entity = { text: string; label: string; start: number; end: number }
export type Sample = { text: string; entities: Entity[] }
export type ParsedData = {
  class: string
  entities: string[]
  samples: Sample[]
}
