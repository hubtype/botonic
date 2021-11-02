import { SendMessageRequest } from 'aws-sdk/clients/sqs'

import { sha256 } from './hashing'

interface UnnormalizedMessage {
  userId: string
}
// Ref.: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-additional-fifo-queue-recommendations.html
export function buildSendMessageRequestForQueue(
  message: UnnormalizedMessage,
  queueUrl: string
): SendMessageRequest {
  const { userId, ...body } = message
  const messageBody = JSON.stringify(body)
  return {
    MessageGroupId: userId,
    MessageBody: messageBody,
    MessageDeduplicationId: sha256(messageBody),
    QueueUrl: queueUrl,
  }
}
