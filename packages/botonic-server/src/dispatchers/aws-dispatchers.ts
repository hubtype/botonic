import { SQS } from 'aws-sdk'

import { buildSendMessageRequestForQueue } from '../sqs-utils'

export class AWSDispatchers {
  sqs
  constructor() {
    this.sqs = new SQS({
      apiVersion: '2012-11-05',
      region: process.env.AWS_REGION,
    })
  }
  async dispatch(handlerName, params) {
    const messageRequest = buildSendMessageRequestForQueue(
      params,
      process.env[`${handlerName}_QUEUE_URL`]
    )
    await this.sqs.sendMessage(messageRequest).promise()
  }
}
