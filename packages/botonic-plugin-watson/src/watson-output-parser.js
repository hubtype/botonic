export default class WatsonOutputParser {
  UNKNOWN_INTENT_LABEL = 'unknown'
  UNKNOWN_INTENT_CONFIDENCE = 1
  UNKNOWN_INTENT = {
    label: this.UNKNOWN_INTENT_LABEL,
    confidence: this.UNKNOWN_INTENT_CONFIDENCE,
  }

  static parse(output) {
    return {
      intent: this.parseIntents(output.intents),
      entities: this.parseEntities(output.entities),
      defaultFallback: output.generic,
    }
  }

  static parseIntents(intents) {
    if (intents.length == 0) return this.UNKNOWN_INTENT
    intents.sort((i1, i2) => (i1.confidence > i2.confidence ? -1 : 1))
    return {
      label: intents[0].intent,
      confidence: intents[0].confidence,
    }
  }

  static parseEntities(entities) {
    return entities.map(e => {
      return { value: e.value, entity: e.entity, confidence: e.confidence }
    })
  }
}
