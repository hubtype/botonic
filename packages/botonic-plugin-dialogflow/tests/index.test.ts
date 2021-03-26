// eslint-disable-next-line import/named
import { BotRequest } from '@botonic/core'

import BotonicPluginDialogflow from '../src/index'
import { Credentials } from '../src/types'

it('Pre response is rejected when using fake crededentials', async () => {
  /* eslint-disable @typescript-eslint/naming-convention */
  const fakeCredentials: Credentials = {
    private_key_id: 'WWW',
    private_key: 'XXX',
    client_email: 'fake_key',
    project_id: 'ZZZ',
  }
  const request: BotRequest = {
    input: { data: 'hi', payload: 'payload', type: 'audio' },
    session: { bot: { id: 'test' }, user: { id: 'user1', provider: 'dev' } },
    lastRoutePath: 'initial',
  }

  expect.assertions(1)
  await expect(
    new BotonicPluginDialogflow(fakeCredentials).pre(request)
  ).rejects.toContain('init failed:')
})
