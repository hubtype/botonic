import { SQS } from 'aws-sdk'

import { buildSendMessageRequestForQueue } from '../sqs-utils'

export class SQSPublisher {
  sqs: SQS
  queueUrl: string | undefined
  constructor(queueUrl: string | undefined = undefined) {
    this.sqs = new SQS({
      apiVersion: '2012-11-05',
      region: process.env.AWS_REGION,
    })
    this.queueUrl = queueUrl
  }
  async publish(message: any): Promise<void> {
    if (this.queueUrl !== undefined) {
      // TODO: This should be refactored as an environment variable. Also, check how permissions should be given in Pulumi
      const messageRequest = buildSendMessageRequestForQueue(
        message,
        this.queueUrl
      )
      const { QueueUrl, ...params } = messageRequest
      try {
        console.log('queueing to', QueueUrl, params)
        await this.sqs.sendMessage(messageRequest).promise()
      } catch (e) {
        console.error({ e })
      }
    }
  }
}

let sqsPublisher: SQSPublisher

export class SQSPublisherFactory {
  public static getInstance(queueUrl: string | undefined): SQSPublisher {
    if (!sqsPublisher) {
      sqsPublisher = new SQSPublisher(queueUrl)
    }
    return sqsPublisher
  }
}
