import { HubtypeService } from './hubtype-service'

describe('HubtypeService', () => {
  test.each([
    [{ user: { id: 'userId' } }],
    [{ appId: 'appId' }],
    [{ appId: '', user: { id: 'userId' } }],
    [{ appId: 'appId', user: { id: undefined } }],
  ])('init fails if user or appid are empty: %s', async args => {
    const sut = new HubtypeService(args)

    await expect(sut.init()).rejects.toEqual(
      'No User or appId. Clear cache and reload'
    )
  })

  test('init timeouts when it cannot connect to hubtype', async () => {
    const sut = new HubtypeService({ appId: 'appId', user: { id: 'userId' } })
    sut.PUSHER_CONNECT_TIMEOUT_MS = 20
    // will fail because _HUBTYPE_API_URL_ is not configured for unit tests
    await expect(sut.init()).rejects.toEqual('Connection Timeout')
  })
})
