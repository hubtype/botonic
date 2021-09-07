import { SQS } from 'aws-sdk'
import { v4 } from 'uuid'

export class Handlers {
  localHandlers
  sqs
  constructor(handlers) {
    if (!handlers) {
      this.sqs = new SQS({ apiVersion: '2012-11-05', region: 'eu-west-1' })
    } else this.localHandlers = handlers
  }
  async run(handlerName, params) {
    if (this.localHandlers) {
      await this.localHandlers[handlerName](params)
    } else {
      try {
        const msgId = v4()
        const sqsParams = {
          MessageBody: JSON.stringify(params),
          MessageDeduplicationId: msgId,
          MessageGroupId: msgId,
          QueueUrl: process.env[`${handlerName}_QUEUE_URL`],
        }
        console.log('queueuing to', sqsParams.QueueUrl)
        await this.sqs.sendMessage(sqsParams).promise()
      } catch (e) {
        console.log({ e })
      }
    }
  }
}
