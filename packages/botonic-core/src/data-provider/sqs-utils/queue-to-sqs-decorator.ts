import { SQSEnqueuerFactory } from './sqs-enqueuer-factory'

export const hubtypeSqsEnqueuer = SQSEnqueuerFactory.getInstance(
  // process.env.HUBTYPE_QUEUE_URL
  undefined
)

export function enqueueToHubtypeSQS() {
  return function (
    _target: any,
    _decoratedMethodName: string,
    descriptor: any
  ) {
    const targetMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const returnedValue = await targetMethod.apply(this, args)
      await hubtypeSqsEnqueuer?.enqueue(returnedValue)
      return returnedValue
    }
    return descriptor
  }
}
