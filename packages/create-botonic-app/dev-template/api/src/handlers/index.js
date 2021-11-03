import { Handlers } from '@botonic/api/src/handlers'
import { Environments } from '@botonic/api/src/index'

export const handlers =
  // eslint-disable-next-line no-undef
  ENV === Environments.LOCAL
    ? new Handlers({
        botExecutor: require('./botExecutor').default,
        sender: require('./sender').default,
      })
    : new Handlers(undefined)
