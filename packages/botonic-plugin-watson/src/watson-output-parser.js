export default class WatsonOutputParser {
  static UNKNOWN_INTENT = {
    intent: null,
    confidence: 0,
  }

  static parseToBotonicFormat(output) {
    const intent =
      this.getIntentWithMaxConfidence(output.intents) || this.UNKNOWN_INTENT
    return {
      intent: intent.intent,
      confidence: intent.confidence,
      intents: output.intents,
      entities: output.entities,
    }
  }

  static getIntentWithMaxConfidence(intents) {
    if (intents.length == 0) {
      return null
    }
    intents.sort((i1, i2) => (i1.confidence > i2.confidence ? -1 : 1))
    return intents[0]
  }
}
