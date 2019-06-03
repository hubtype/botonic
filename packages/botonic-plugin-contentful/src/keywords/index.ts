import { ContentCallback } from '../cms';
import { tokenizeAndStem } from '../nlp';
import * as cms from '../cms';
import { KeywordsParser } from '../nlp/keywords';

export class Keywords {
  constructor(readonly cms: cms.CMS) {}

  tokenize(inputText: string): string[] {
    return tokenizeAndStem(inputText);
  }

  async suggestContentsForInput(
    tokens: string[],
    keywordsFoundTextId: string,
    keywordsNotFoundTextId: string
  ): Promise<cms.Text> {
    let [foundText, notFoundText, contentsWithKeywords] = await Promise.all([
      this.cms.text(keywordsFoundTextId),
      this.cms.text(keywordsNotFoundTextId),
      this.cms.contentsWithKeywords()
    ]);
    let kws = new KeywordsParser<cms.ContentCallbackWithKeywords>();
    contentsWithKeywords.forEach(content =>
      kws.addCandidate(content, content.keywords)
    );
    let matches = kws.findCandidatesWithKeywordsAt(tokens);

    if (matches.length == 0) {
      return notFoundText.cloneWithFilteredButtons(b => false);
    }
    let buttons = matches.map(match => match.toButton());
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
      return (await anyCallback.deliverPayloadContent(this.cms)) as cms.Text;
    }
    // remove chitchats if input text matches with some keywords
    return text.cloneWithFilteredButtons(b => !onlyChitChatsFunc(b));
  }
}
