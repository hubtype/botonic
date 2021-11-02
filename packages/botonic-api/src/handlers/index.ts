import { buildSendMessageRequestForQueue } from '@botonic/core/lib/esm/data-provider/sqs-utils'
import { SQS } from 'aws-sdk'
import { v4 } from 'uuid'
export class Handlers {
  localHandlers
  sqs
  constructor(handlers) {
    if (handlers) this.localHandlers = handlers
    else {
      this.sqs = new SQS({
        apiVersion: '2012-11-05',
        region: process.env.AWS_REGION,
      })
    }
  }
  async run(handlerName, params) {
    if (this.localHandlers) {
      await this.localHandlers[handlerName](params)
    } else {
      try {
        const messageRequest = buildSendMessageRequestForQueue(
          params,
          process.env[`${handlerName}_QUEUE_URL`]
        )
        console.log('queueing to', messageRequest.QueueUrl)
        await this.sqs.sendMessage(messageRequest).promise()
      } catch (e) {
        console.log({ e })
      }
    }
  }
}
