import { LANG_FLAG } from './constants'
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

export function shuffle(obj1, obj2) {
  // shuffle 2 arrays with same length preserving their relative indices
  // Fisher-Yates Shuffle: https://stackoverflow.com/a/2450976/145289
  let idx = obj1.length
  let rnd = undefined
  while (idx) {
    rnd = Math.floor(Math.random() * idx)
    idx -= 1
    ;[obj1[idx], obj1[rnd]] = [obj1[rnd], obj1[idx]]
    ;[obj2[idx], obj2[rnd]] = [obj2[rnd], obj2[idx]]
  }
}

export function clone(src) {
  return Object.assign([], src)
}

export function printPrettyConfig(params) {
  console.log('\n\n*******************************************')
  console.log(`\n\nTRAINING MODEL FOR ${params.language}`)
  console.log('\nRUNNING WITH CONFIGURATION:')
  let maxKeyLength = 0
  for (let key in params) {
    if (key.length > maxKeyLength) {
      maxKeyLength = key.length
    }
  }
  for (let key in params) {
    let param = key + Array(maxKeyLength + 1 - key.length).join(' ')
    console.log(`   ${param} = ${params[key]}`)
  }
  console.log('\n')
  console.log('*******************************************')
}

export function parseLangFlag(args) {
  args = args.slice(2)
  for (let i = 0; i < args.length; i++) {
    if (args[i] == LANG_FLAG && args[i + 1]) {
      return [args[i + 1]]
    }
  }
  return undefined
}

export function filterObjectByWhitelist(object, whiteList) {
  return Object.keys(object)
    .filter(key => whiteList.includes(key))
    .reduce((obj, key) => {
      obj[key] = object[key]
      return obj
    }, {})
}
