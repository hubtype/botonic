import { default as nlp } from 'compromise'
import { default as compromisePlugin } from 'compromise-plugin'
import { DEFAULT_ENTITIES } from './constants'

function listContainEntity(obj, list) {
  for (let item of list) {
    if (obj.type == item.type && obj.value == item.value) {
      return true
    }
  }
  return false
}

export function getEntities(input, devEntities) {
  let entities = {}
  let taggedEntities = []
  let tagList = DEFAULT_ENTITIES.concat(devEntities.tagList)
  nlp.plugin(
    compromisePlugin.pack({ words: devEntities.words, tags: devEntities.tags })
  )
  let processedInput = nlp(input)
  entities.places = processedInput.places().out('array')
  entities.organizations = processedInput.organizations().out('array')
  entities.people = processedInput.people().out('array')
  entities.dates = processedInput.dates().out('array')
  entities.values = processedInput.values().out('array')
  for (let tag of tagList) {
    for (let taggedToken of processedInput.out('tags')) {
      if (taggedToken.tags.includes(tag)) {
        let entity = { value: taggedToken.text, tags: taggedToken.tags }
        if (!listContainEntity(entity, taggedEntities)) {
          taggedEntities.push(entity)
        }
      }
    }
  }
  entities.tags = taggedEntities
  return entities
}
