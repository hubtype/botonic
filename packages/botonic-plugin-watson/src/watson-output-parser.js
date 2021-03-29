export default class WatsonOutputParser {
  static UNKNOWN_INTENT_LABEL = null
  static UNKNOWN_INTENT_CONFIDENCE = 0
  static UNKNOWN_INTENT = {
    intent: this.UNKNOWN_INTENT_LABEL,
    confidence: this.UNKNOWN_INTENT_CONFIDENCE,
  }

  static parseToBotonicFormat(output) {
    const intent = this.getIntentWithMaxConfidence(output.intents)
    return {
      intent: intent.intent,
      confidence: intent.confidence,
      intents: output.intents,
      entities: this.parseEntities(output.entities),
    }
  }

  static getIntentWithMaxConfidence(intents) {
    intents.sort((i1, i2) => (i1.confidence > i2.confidence ? -1 : 1))
    return intents.length == 0 ? this.UNKNOWN_INTENT : intents[0]
  }

  static parseEntities(entities) {
    return entities.map(e => {
      return { entity: e.entity, value: e.value, confidence: e.confidence }
    })
  }
}
