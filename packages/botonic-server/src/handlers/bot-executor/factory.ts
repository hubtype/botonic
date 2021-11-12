import { Environments } from '../../constants'
import { awsHandler } from './aws/handler'
import { devHandler } from './dev/handler'

export function botExecutorHandlerFactory(env, bot, dataProvider, dispatchers) {
  if (env === Environments.LOCAL) {
    return devHandler(bot, dataProvider, dispatchers)
  }
  if (env === Environments.AWS) {
    return awsHandler(bot, dataProvider, dispatchers)
  }
}
