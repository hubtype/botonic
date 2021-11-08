import { Environments } from '../constants'
import { AWSDispatchers } from './aws-dispatchers'
import { LocalDispatchers } from './local-dispatchers'

export function dispatchersFactory(env, handlers) {
  // @ts-ignore
  if (ENV === Environments.LOCAL) {
    /**
     * passing 'env' here instead of Webpack's define plugin variable makes the application to crash or have unexpected behavior
     * TODO: investigate how this should be done in Webpack or if it's a bug
     * */
    return new LocalDispatchers(handlers)
  }
  return new AWSDispatchers()
}
