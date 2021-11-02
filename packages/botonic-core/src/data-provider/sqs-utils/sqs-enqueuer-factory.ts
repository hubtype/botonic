import { SQS } from 'aws-sdk'
import {
  MessageBodyAttributeMap,
  SendMessageRequest,
} from 'aws-sdk/clients/sqs'

export class SQSEnqueuer {
  sqs: SQS
  constructor() {
    this.sqs = new SQS({
      apiVersion: '2012-11-05',
      region: process.env.AWS_REGION,
    })
  }
  public async enqueue(
    messageBody: string,
    messageAttributes: MessageBodyAttributeMap
  ): Promise<void> {
    const msgId = String(Math.random())
    const messageRequest: SendMessageRequest = {
      MessageBody: JSON.stringify(messageBody),
      MessageAttributes: messageAttributes,
      MessageDeduplicationId: msgId,
      MessageGroupId: msgId,
      // TODO: This should be refactored as an environment variable. Also, check how permissions should be given in Pulumi
      QueueUrl: process.env.HUBTYPE_QUEUE_URL,
    }
    const { QueueUrl, ...params } = messageRequest
    try {
      console.log('queueing to', QueueUrl, params)
      await this.sqs.sendMessage(messageRequest).promise()
    } catch (e) {
      console.error({ e })
    }
  }
}

let sqsEnqueuer: SQSEnqueuer

export class SQSEnqueuerFactory {
  public static getInstance(): SQSEnqueuer {
    if (!sqsEnqueuer) {
      sqsEnqueuer = new SQSEnqueuer()
    }
    return sqsEnqueuer
  }
}
