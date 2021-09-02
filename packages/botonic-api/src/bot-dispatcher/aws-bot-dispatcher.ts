import { SQS } from 'aws-sdk'
import { v4 } from 'uuid'

import { BotDispatcher, DispatchArgs } from '.'

export class AWSBotDispatcher implements BotDispatcher {
  sqs: SQS
  constructor() {
    this.sqs = new SQS({ apiVersion: '2012-11-05', region: 'eu-west-1' }) // TODO: as process.env
  }
  async dispatch({
    input,
    session,
    lastRoutePath,
    websocketId,
  }: DispatchArgs): Promise<void> {
    console.log('DISPATCHING WITH SQS')
    const msgId = v4()
    const sqsParams = {
      MessageBody: JSON.stringify({
        input,
        session,
        lastRoutePath,
        websocketId,
      }),
      MessageDeduplicationId: msgId, // Required for FIFO queues
      MessageGroupId: msgId, // Required for FIFO queues
      QueueUrl: process.env.NEW_EVENTS_QUEUE_URL as string,
    }
    await this.sqs.sendMessage(sqsParams).promise()
  }
}
