import { INPUT, PluginPreRequest } from '@botonic/core'

import BotonicPluginDialogflow from '../src/index'
import { Options } from '../src/types'

it('Pre response is rejected when using fake credentials', async () => {
  /* eslint-disable @typescript-eslint/naming-convention */
  const fakeOptions: Options = {
    credentials: {
      private_key_id: 'WWW',
      private_key: 'XXX',
      client_email: 'fake_key',
      project_id: 'ZZZ',
    },
  }

  const request: PluginPreRequest = {
    input: {
      data: 'hi',
      payload: 'payload',
      type: INPUT.AUDIO,
      message_id: 'testMessageId',
      bot_interaction_id: 'testBotInteractionId',
    },
    session: {
      bot: { id: 'test' },
      // @ts-ignore
      user: { id: 'user1', provider: 'dev' },
      is_first_interaction: true,
      __retries: 0,
    },
    lastRoutePath: 'initial',
  }

  expect.assertions(1)
  await expect(
    new BotonicPluginDialogflow(fakeOptions).pre(request)
  ).rejects.toContain('init failed:')
})
