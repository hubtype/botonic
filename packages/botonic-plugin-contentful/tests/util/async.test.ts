import { asyncMap } from '../../src/util/async'

test('TEST: asyncMap errorTreatment', async () => {
  const ctx = { locale: 'ru' }
  const errors: number[] = []

  const result = await asyncMap(
    ctx,
    [-2, -1, 0, 1],
    item => {
      if (item < 0) throw new Error()
      return Promise.resolve(String(item))
    },
    undefined,
    item => {
      errors.push(item)
      return undefined
    }
  )

  expect(result).toIncludeSameMembers(['0', '1'])
  expect(errors).toIncludeSameMembers([-2, -1])
})
