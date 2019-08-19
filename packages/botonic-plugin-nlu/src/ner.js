import { default as nlp } from 'compromise'
import { default as compromisePlugin } from 'compromise-plugin'
import { COMPROMISE_DEFAULT_ENTITIES } from '../src/constants'

function listContainEntity(obj, list) {
  for (let item of list) {
    if (obj.type == item.type && obj.value == item.value) {
      return true
    }
  }
  return false
}

export function processEntities(userInput, entities) {
  let entitiesResults = []
  let tagList = COMPROMISE_DEFAULT_ENTITIES.concat(entities.tagList)
  nlp.plugin(
    compromisePlugin.pack({ words: entities.words, tags: entities.tags })
  )
  let processedInput = nlp(userInput)
  let places = processedInput.places().out('array')
  let organizations = processedInput.organizations().out('array')
  let people = processedInput.people().out('array')
  let dates = processedInput.dates().out('array')
  let values = processedInput.values().out('array')
  for (let tag of tagList) {
    for (let taggedToken of processedInput.out('tags')) {
      if (taggedToken.tags.includes(tag)) {
        let entity = { value: taggedToken.text, tags: taggedToken.tags }
        if (!listContainEntity(entity, entitiesResults)) {
          entitiesResults.push(entity)
        }
      }
    }
  }
  return {
    entities: {
      tags: entitiesResults,
      places,
      organizations,
      people,
      dates,
      values
    }
  }
}
