export default class WatsonOutputParser {
  static UNKNOWN_INTENT = {
    intent: null,
    confidence: 0,
  }

  static parseToBotonicFormat(output) {
    const intent = this.getIntentWithMaxConfidence(output.intents)
    return {
      intent: intent.intent,
      confidence: intent.confidence,
      intents: output.intents,
      entities: output.entities,
    }
  }

  static getIntentWithMaxConfidence(intents) {
    intents.sort((i1, i2) => (i1.confidence > i2.confidence ? -1 : 1))
    return intents.length == 0 ? this.UNKNOWN_INTENT : intents[0]
  }
}
