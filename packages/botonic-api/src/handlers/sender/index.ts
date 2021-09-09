import { Environments } from '../..'
import { awsSender } from './aws-sender'
import { localSender } from './local-sender'

export function senderHandlerFactory(env) {
  if (env === Environments.LOCAL) return localSender
  if (env === Environments.AWS) {
    return async function (event, context) {
      try {
        const { body } = event.Records[0]
        const { messages, websocketId } = JSON.parse(body)
        await awsSender({ messages, websocketId })
      } catch (e) {
        console.error(e)
        return {
          statusCode: 500,
        }
      }
      return {
        statusCode: 200,
      }
    }
  }
}
