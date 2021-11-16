import { SendMessageRequest } from 'aws-sdk/clients/sqs'
import crypto from 'crypto'

function sha256(message: string): string {
  return crypto.createHash('sha256').update(message).digest('hex')
}

interface UnnormalizedMessage {
  userId: string
}
// Ref.: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-additional-fifo-queue-recommendations.html
export function buildSendMessageRequestForQueue(
  message: UnnormalizedMessage,
  queueUrl: string
): SendMessageRequest {
  const { userId, ...body } = message
  const messageBody = JSON.stringify(message)
  return {
    MessageGroupId: userId,
    MessageBody: messageBody,
    MessageDeduplicationId: sha256(messageBody),
    QueueUrl: queueUrl,
  }
}
