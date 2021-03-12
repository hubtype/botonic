export type AugmenterMap = { [keyword: string]: string[] }
export type FoundEntity = {
  text: string
  label: string
  start: number
  end: number
}
export type Sample = { text: string; entities: FoundEntity[]; class: string }
export type Dataset = {
  classes: string[]
  entities: string[]
  samples: Sample[]
}
