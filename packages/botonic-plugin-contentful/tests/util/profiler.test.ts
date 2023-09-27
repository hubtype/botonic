import { sleep } from 'async-parallel'

import { Measure, Profiler } from '../../src/util/profiler'

test('TEST: Measure does not mix same names', async () => {
  Profiler.enable()
  const m1 = new Measure('hola')
  await sleep(100)
  const m2 = new Measure('hola')
  await sleep(75)
  m1.end()
  m2.end()
  console.log(Profiler.getSummaryAll())
  Profiler.disable()
})

test('TEST: Measure.end returns its argument', () => {
  Profiler.enable()
  const m1 = new Measure('hola')
  expect(m1.end({ 2: 3 })).toEqual({ 2: 3 })
  Profiler.disable()
})

// TODO: fix 'Cannot read property 'length' of undefined'
test.skip('TEST: Measure without name', () => {
  Profiler.enable()
  const m1 = new Measure('')
  m1.end()
  expect(Profiler.getCallCount('<NO_NAME>')).toEqual(1)

  const m2 = new Measure(undefined as any as string)
  m2.end()
  expect(Profiler.getCallCount('<NO_NAME>')).toEqual(2)
  Profiler.disable()
})

test('TEST: long name', () => {
  Profiler.enable()
  const m1 = new Measure('hola')
  m1.end()
  const m2 = new Measure('1234567890'.repeat(10))
  m2.end()
  console.log(Profiler.getSummaryAll())
  Profiler.disable()
})
