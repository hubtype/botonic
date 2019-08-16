const nlp = require('compromise')

const entitiesSet = {
  PLACES: 'places',
  PEOPLE: 'people',
  ORGANIZATIONS: 'organizations'
}

export function processEntities(userInput) {
  let res = nlp(userInput)
  let obj = {}
  for (let e in entitiesSet) {
    let o = res[entitiesSet[e]]().out()
    if (o) {
      o = o.trim().split(' ')
    }
    obj[`${entitiesSet[e]}`] = o
  }
  return obj
}
