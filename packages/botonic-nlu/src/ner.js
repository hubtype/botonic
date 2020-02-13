import { default as nlp } from 'compromise'
import { default as compromisePlugin } from 'compromise-plugin'
import { DEFAULT_ENTITIES } from './constants'

function listContainsEntity(entity, list) {
  for (const item of list) {
    if (entity.type == item.type && entity.value == item.value) {
      return true
    }
  }
  return false
}

export function getEntities(input, devEntities) {
  const entities = {}
  const taggedEntities = []
  const tagList = DEFAULT_ENTITIES.concat(devEntities.tagList)
  nlp.plugin(
    compromisePlugin.pack({ words: devEntities.words, tags: devEntities.tags })
  )
  const processedInput = nlp(input)
  entities.places = processedInput.places().out('array')
  entities.organizations = processedInput.organizations().out('array')
  entities.people = processedInput.people().out('array')
  entities.dates = processedInput.dates().out('array')
  entities.values = processedInput.values().out('array')
  for (const tag of tagList) {
    for (const taggedToken of processedInput.out('tags')) {
      if (taggedToken.tags.includes(tag)) {
        const entity = { value: taggedToken.text, tags: taggedToken.tags }
        if (!listContainsEntity(entity, taggedEntities)) {
          taggedEntities.push(entity)
        }
      }
    }
  }
  entities.tags = taggedEntities
  return entities
}
