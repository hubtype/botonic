import { SQS } from 'aws-sdk'

import { buildSendMessageRequestForQueue } from './send-message-request'

export class SQSEnqueuer {
  sqs: SQS
  queueUrl: string | undefined
  constructor(queueUrl: string | undefined = undefined) {
    this.sqs = new SQS({
      apiVersion: '2012-11-05',
      region: process.env.AWS_REGION,
    })
    this.queueUrl = queueUrl
  }
  public async enqueue(message: any): Promise<void> {
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

let sqsEnqueuer: SQSEnqueuer

export class SQSEnqueuerFactory {
  public static getInstance(queueUrl: string | undefined): SQSEnqueuer {
    if (!sqsEnqueuer && queueUrl) {
      sqsEnqueuer = new SQSEnqueuer(queueUrl)
    }
    return sqsEnqueuer
  }
}
