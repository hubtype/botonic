import { Dispatchers } from '@botonic/api/src/handlers'
import { Environments } from '@botonic/api/src/index'

export const dispatchers =
  // eslint-disable-next-line no-undef
  ENV === Environments.LOCAL
    ? new Dispatchers({
        botExecutor: require('./botExecutor').default,
        sender: require('./sender').default,
      })
    : new Dispatchers(undefined)
