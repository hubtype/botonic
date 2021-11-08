import { SQSEnqueuerFactory } from './sqs-enqueuer-factory'

export const sqsEnqueuer = SQSEnqueuerFactory.getInstance(
  process.env.EXTERNAL_SYSTEM_URL
)
