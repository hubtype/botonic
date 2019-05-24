import * as cms from '../cms';
import { KeywordsParser } from '../nlp/keywords';

export class Keywords {
  constructor(readonly cms: cms.CMS) {}

  tokenize(inputText: string): string[] {
    return normalize(inputText);
  }

  async suggestTextsForInput(
    tokens: string[],
    keywordsFoundTextId: string,
    keywordsNotFoundTextId: string
  ): Promise<cms.Text> {
    let [foundText, notFoundText, allButtons] = await Promise.all([
      this.cms.text(keywordsFoundTextId),
      this.cms.text(keywordsNotFoundTextId),
      this.cms.textsWithKeywordsAsButtons()
    ]);
    let kws = new KeywordsParser<cms.ButtonsWithKeywords>();
    allButtons.forEach(but => kws.addCandidate(but, but.keywords));
    let matches = kws.findCandidatesWithKeywordsAt(tokens);

    if (matches.length == 0) {
      return new cms.Text(notFoundText.name, notFoundText.text, []);
    }
    let buttons = matches.map(match => match.button);
    return new cms.Text(foundText.name, foundText.text, buttons);
  }
}
