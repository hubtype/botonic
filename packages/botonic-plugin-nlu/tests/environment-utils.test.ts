import { isProd } from '../src/environment-utils'

test('env is not Prod', () => {
  expect(isProd).toEqual(false)
})
