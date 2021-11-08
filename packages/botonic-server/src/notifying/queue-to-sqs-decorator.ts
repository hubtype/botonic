import { SQSEnqueuerFactory } from './sqs-enqueuer-factory'

const sqsEnqueuer = SQSEnqueuerFactory.getInstance()

export function enqueueToSQS(queueUrl: string | undefined) {
  return function (
    _target: any,
    _decoratedMethodName: string,
    descriptor: any
  ) {
    const targetMethod = descriptor.value
    try {
      descriptor.value = async function (...args: any[]) {
        const returnedValue = await targetMethod.apply(this, args)
        await sqsEnqueuer?.enqueue(returnedValue, queueUrl)
        return returnedValue
      }
      return descriptor
    } catch (e) {
      console.error('Cannot send integration event', e)
    }
  }
}
