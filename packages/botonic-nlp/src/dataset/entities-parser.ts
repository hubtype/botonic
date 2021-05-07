export type DefinedEntity = { start: number; end: number; label: string }

export class EntitiesParser {
  private ENTITY_DEFINITION_PATTERN = /\[(.*?)\]\((.*?)\)/gm

  constructor(readonly entities: string[]) {}

  parse(sentence: string): { text: string; entities: DefinedEntity[] } {
    const definedEntities = []

    let text = sentence
    let m
    let accumulation = 0

    while ((m = this.ENTITY_DEFINITION_PATTERN.exec(sentence))) {
      const entityDefinition = m[0]
      const entityText = m[1]
      const entityLabel = m[2]

      if (!this.entities.includes(entityLabel)) {
        throw new Error(`Undefined entity: ${entityLabel}`)
      }

      text = text
        .slice(0, m.index - accumulation)
        .concat(
          entityText,
          text.slice(m.index + entityDefinition.length - accumulation)
        )

      definedEntities.push({
        label: entityLabel,
        start: m.index - accumulation,
        end: m.index + entityText.length - accumulation,
      })

      accumulation += entityDefinition.length - entityText.length
    }

    return { text, entities: definedEntities }
  }
}
