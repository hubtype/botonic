import { awsSender } from './aws-sender'
import { localSender } from './local-sender'

export function senderHandlerFactory(env) {
  if (env === 'local') return localSender
  if (env === 'aws') {
    return async function (event, context) {
      try {
        const { body } = event.Records[0]
        const { messages, websocketId } = JSON.parse(body)
        await awsSender({ messages, websocketId })
      } catch (e) {
        console.log(e)
      }
      return {
        statusCode: 200,
      }
    }
  }
}
