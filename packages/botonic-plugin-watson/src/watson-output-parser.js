export default class WatsonOutputParser {
  static UNKNOWN_INTENT_LABEL = null
  static UNKNOWN_INTENT_CONFIDENCE = 0

  static parseToBotonicFormat(output) {
    output.intents.sort((i1, i2) => (i1.confidence > i2.confidence ? -1 : 1))
    return {
      intent: this.getIntentWithMaxConfidence(output.intents),
      confidence: this.getMaxConfidence(output.intents),
      intents: output.intents,
      entities: this.parseEntities(output.entities),
    }
  }

  static getIntentWithMaxConfidence(intents) {
    return intents.length == 0 ? this.UNKNOWN_INTENT_LABEL : intents[0].intent
  }

  static getMaxConfidence(intents) {
    return intents.length == 0
      ? this.UNKNOWN_INTENT_CONFIDENCE
      : intents[0].confidence
  }

  static parseEntities(entities) {
    return entities.map(e => {
      return { entity: e.entity, value: e.value, confidence: e.confidence }
    })
  }
}
