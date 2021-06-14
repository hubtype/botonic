import memoize from 'memoizee'

// import { sleep } from '../../../src/util/backoff'

let doThrow = true
async function fn(): Promise<number> {
  console.log('calling')
  if (doThrow) {
    return Promise.reject()
  }
  return Promise.resolve(2)
}
export async function main() {
  const mfn = memoize(fn, {
    promise: true,
    primitive: true,
    // max: 100,
    maxAge: 1000 * 60 * 60,
  })
  doThrow = true
  // try {
  //   await mfn()
  // } catch (e) {
  //   console.log('threw', e)
  //   await sleep(0)
  //   // await new Promise(resolve => setTimeout(resolve, 1))
  // }
  //await new Promise(resolve => setTimeout(resolve, 0))

  doThrow = false
  await mfn()
  // console.log('1 ok')
  // .then(r => console.log('ok', r))
  // .catch(c => console.log('ko', c))
  await mfn()
  // console.log('2 ok')
  // .then(r => console.log('ok', r))
  // .catch(c => console.log('ko', c))
}

// void main()

test('TEST: low level', async () => {
  const mfn = memoize(fn, {
    promise: true,
    primitive: true,
    // max: 100,
    maxAge: 1000 * 60 * 60,
  })
  doThrow = true

  doThrow = false
  await mfn()
  console.log('1 ok')
  // .then(r => console.log('ok', r))
  // .catch(c => console.log('ko', c))
  await mfn()
  console.log('2 ok')
})
