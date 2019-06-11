import { CallbackToContentWithKeywords, CMS, Text } from '../cms';
import { IntentPredictorFromKeywords } from './intent_from_keywords';

export class Intents {
  readonly predictor: IntentPredictorFromKeywords;
  /**
   * @param maxButtons Some providers only support 3 buttons
   */
  constructor(
    private readonly cms: CMS,
    predictor?: IntentPredictorFromKeywords,
    readonly maxButtons: number = 3
  ) {
    this.predictor = predictor || new IntentPredictorFromKeywords(cms);
  }

  async predictIntent(
    inputText: string
  ): Promise<CallbackToContentWithKeywords[]> {
    let tokens = this.predictor.tokenize(inputText);
    let callbacks = await this.predictor.suggestContentsFromInput(tokens);
    return await this.predictor.filterChitchat(tokens, callbacks);
  }

  async respondIntents(
    intents: CallbackToContentWithKeywords[],
    confirmIntentFoundTextId: string,
    notIntentFoundTextId: string
  ): Promise<Text> {
    if (intents.length == 0) {
      return this.cms.text(notIntentFoundTextId);
    }
    let chitchatCallback = intents[0].getCallbackIfChitchat();
    if (chitchatCallback) {
      return this.cms.chitchat(chitchatCallback.id);
    }
    let buttons = intents.map(callback => callback.toButton());
    buttons = buttons.slice(0, this.maxButtons);
    let text = await this.cms.text(confirmIntentFoundTextId);
    return text.cloneWithButtons(buttons);
  }
}

export * from './intent_from_keywords';
export default Intents;
