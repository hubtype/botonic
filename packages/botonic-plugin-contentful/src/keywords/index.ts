import * as cms from '../cms';
import { KeywordsParser } from '../nlp/keywords';

export class Keywords {
  constructor(readonly cms: cms.CMS) {}

  async suggestTextsForInput(
    inputText: string,
    keywordsFoundTextId: string,
    keywordsNotFoundTextId: string
  ): Promise<cms.Text> {
    let [foundText, notFoundText, allButtons] = await Promise.all([
      this.cms.text(keywordsFoundTextId, new cms.CallbackMap()),
      this.cms.text(keywordsNotFoundTextId, new cms.CallbackMap()),
      this.cms.textsWithKeywordsAsButtons()
    ]);
    let kws = new KeywordsParser<cms.ButtonsWithKeywords>();
    allButtons.forEach(but => kws.addCandidate(but, but.keywords));
    let matches = kws.findCandidatesWithKeywordsAt(inputText);

    if (matches.length == 0) {
      return new cms.Text(notFoundText.name, notFoundText.text, []);
    }
    let buttons = matches.map(match => match.button);
    return new cms.Text(foundText.name, foundText.text, buttons);
  }
}
