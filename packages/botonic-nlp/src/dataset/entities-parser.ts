export type DefinedEntity = { start: number; end: number; label: string }

export class EntitiesParser {
  private ENTITY_DEFINITION_PATTERN = /\[(.*?)\]\((.*?)\)/gm

  constructor(readonly entities: string[]) {}

  parse(sentence: string): { text: string; entities: DefinedEntity[] } {
    const definedEntities = []

    let text = sentence
    let m

    let charactersRemoved = 0 //This value represents the amount of characters removed because of entity definition removal: [shirt](product) -> shirt.

    while ((m = this.ENTITY_DEFINITION_PATTERN.exec(sentence))) {
      const entityDefinition = m[0]
      const entityText = m[1]
      const entityLabel = m[2]

      if (!this.entities.includes(entityLabel)) {
        throw new Error(`Undefined entity '${entityLabel}'`)
      }

      text = text
        .slice(0, m.index - charactersRemoved)
        .concat(
          entityText,
          text.slice(m.index + entityDefinition.length - charactersRemoved)
        )

      definedEntities.push({
        label: entityLabel,
        start: m.index - charactersRemoved,
        end: m.index + entityText.length - charactersRemoved,
      })

      charactersRemoved += entityDefinition.length - entityText.length
    }

    return { text, entities: definedEntities }
  }
}
