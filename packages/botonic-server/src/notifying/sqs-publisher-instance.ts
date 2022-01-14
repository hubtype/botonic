import { SQSPublisherFactory } from './sqs-publisher-factory'

export const sqsPublisher = SQSPublisherFactory.getInstance(
  process.env.EXTERNAL_SQS_URL
)
