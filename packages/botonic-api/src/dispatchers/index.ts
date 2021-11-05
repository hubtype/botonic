import { Environments } from '..'
import { AWSDispatchers } from './aws-dispatchers'
import { LocalDispatchers } from './local-dispatchers'

export function dispatchersFactory(env, handlers) {
  // @ts-ignore
  if (ENV === Environments.LOCAL) {
    return new LocalDispatchers(handlers)
  }
  return new AWSDispatchers()
}
