import * as cms from '../cms'

export interface KeywordsOptions {}

export class Search {
  constructor(
    readonly cms: cms.CMS,
    readonly keywordsOptions: KeywordsOptions
  ) {}

  async searchByKeywords(input: string) {
    return await this.cms.contentsWithKeywords(input)
  }
}
