import { buildSendMessageRequestForQueue } from '@botonic/core/lib/esm/data-provider/sqs-utils'
import { SQS } from 'aws-sdk'

export class Dispatchers {
  localDispatchers
  sqs
  constructor(dispatchers) {
    if (dispatchers) this.localDispatchers = dispatchers
    else {
      this.sqs = new SQS({
        apiVersion: '2012-11-05',
        region: process.env.AWS_REGION,
      })
    }
  }
  async run(handlerName, params) {
    if (this.localDispatchers) {
      await this.localDispatchers[handlerName](params)
    } else {
      try {
        const messageRequest = buildSendMessageRequestForQueue(
          params,
          process.env[`${handlerName}_QUEUE_URL`]
        )
        await this.sqs.sendMessage(messageRequest).promise()
      } catch (e) {
        console.log({ e })
      }
    }
  }
}
