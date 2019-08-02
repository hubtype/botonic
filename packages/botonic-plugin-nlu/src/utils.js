import path from 'path'

function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

export function shuffle(obj1, obj2) {
  // shuffle two related arrays preserving indexes
  var index = obj1.length
  var rnd, tmp1, tmp2

  while (index) {
    rnd = Math.floor(Math.random() * index)
    index -= 1
    tmp1 = obj1[index]
    tmp2 = obj2[index]
    obj1[index] = obj1[rnd]
    obj2[index] = obj2[rnd]
    obj1[rnd] = tmp1
    obj2[rnd] = tmp2
  }
}

export function clone(src) {
  return Object.assign([], src)
}

export function printPrettyConfig(config) {
  console.log('\n\n*******************************************')
  console.log(`\n\nTRAINING MODEL FOR ${config.LANG}`)
  console.log('\nRUNNING WITH CONFIGURATION:')
  let max = 0
  for (let key in config) {
    if (key.length > max) {
      max = key.length
    }
  }
  for (let key in config) {
    let param = key + Array(max + 1 - key.length).join(' ')
    console.log(`   ${param} = ${config[key]}`)
  }
  console.log('\n')
  console.log('*******************************************')
}
