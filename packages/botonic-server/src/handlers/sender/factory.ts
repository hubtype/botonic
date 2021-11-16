import { Environments } from '../../constants'
import { awsHandler } from './aws/handler'
import { devHandler } from './dev/handler'

export function senderHandlerFactory(env, dataProvider) {
  if (env === Environments.LOCAL) return devHandler(dataProvider)
  if (env === Environments.AWS) return awsHandler(dataProvider)
}
