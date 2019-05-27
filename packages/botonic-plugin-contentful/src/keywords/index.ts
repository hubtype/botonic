import { normalize } from '../nlp';
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

  public async treatChitChat(
    tokens: string[],
    text: cms.Text,
    chitchatShortTexts: string[]
  ): Promise<cms.Text | undefined> {
    const onlyChitChatsFunc = (b: cms.Button) =>
      chitchatShortTexts.includes(b.text);

    const onlyChitChats = text.buttons.filter(onlyChitChatsFunc);
    if (onlyChitChats.length == 0) {
      // no chitchats
      return text;
    }
    if (onlyChitChats.length == text.buttons.length) {
      // all chitchats, no normal keywords
      const estimatedNoChitchatWords = tokens.length - onlyChitChats.length * 2;
      if (estimatedNoChitchatWords > 2) {
        // avoid that a sentence with chitchat and a question without recognized keywords is answered as chitchat
        return undefined;
      }
      let anyCallback = onlyChitChats[0].callback as ContentCallback;
      return (await anyCallback.deliverPayloadModel(this.cms)) as cms.Text;
    }
    // remove chitchats if input text matches with some keywords
    return text.cloneWithFilteredButtons(b => !onlyChitChatsFunc(b));
  }
}
