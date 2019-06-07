import { ContentCallback } from '../cms';
import { tokenizeAndStem } from '../nlp';
import * as cms from '../cms';
import { KeywordsParser } from '../nlp/keywords';

export class Keywords {
  /**
   * @param maxButtons Some providers only support 3 buttons
   */
  constructor(readonly cms: cms.CMS, readonly maxButtons = 3) {}

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
    let kws = new KeywordsParser<cms.CallbackToContentWithKeywords>();
    contentsWithKeywords.forEach(content =>
      kws.addCandidate(content, content.content.keywords!)
    );
    let matches = kws.findCandidatesWithKeywordsAt(tokens);

    if (matches.length == 0) {
      return notFoundText.cloneWithButtons([]);
    }
    let buttons = matches.map(match => match.toButton());
    return new cms.Text(foundText.name, foundText.text, buttons);
  }

  /**
   * Given a {@link cms.Text} returned by {@link suggestContentsForInput}, it analyses the buttons (which refer to
   * normal keywords or to chitchat keywords) and returns the {@link cms.Text} to display.
   * @return undefined when only chitchat keywords were detected but we estimate the sentence contained a question
   * which was not recognized
   */
  public async treatChitChat(
    tokens: string[],
    text: cms.Text,
    chitchatShortTexts: string[]
  ): Promise<cms.Text | undefined> {
    const isChitChat = (b: cms.Button) => chitchatShortTexts.includes(b.text);

    const onlyChitChats = text.buttons.filter(isChitChat);
    if (onlyChitChats.length == 0) {
      return text;
    }
    if (onlyChitChats.length < text.buttons.length) {
      let textWithoutChitChats = text.cloneWithButtons(
        text.buttons.filter(b => !isChitChat(b))
      );
      return textWithoutChitChats.cloneWithButtons(
        textWithoutChitChats.buttons.slice(0, this.maxButtons)
      );
    }
    return await this.treatOnlyChitchats(tokens, onlyChitChats);
  }

  private async treatOnlyChitchats(
    tokens: string[],
    onlyChitChats: cms.Button[]
  ): Promise<cms.Text | undefined> {
    const estimatedNoChitchatWords = tokens.length - onlyChitChats.length * 2;
    if (estimatedNoChitchatWords > 2) {
      // avoid that a sentence with chitchat and a question without recognized keywords is answered as chitchat
      return undefined;
    }
    let anyCallback = onlyChitChats[0].callback as ContentCallback;
    return (await anyCallback.deliverPayloadContent(this.cms)) as cms.Text;
  }
}
