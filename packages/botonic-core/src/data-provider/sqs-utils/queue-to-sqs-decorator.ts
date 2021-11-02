import { SQSEnqueuerFactory } from './sqs-enqueuer-factory'

const sqsEnqueuer = SQSEnqueuerFactory.getInstance()

export function queueToSQS() {
  return function (_target: any, decoratedMethodName: string, descriptor: any) {
    const targetMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const returnedValue = await targetMethod.apply(this, args)
      await sqsEnqueuer.enqueue(returnedValue, {
        ACTION: {
          DataType: 'String',
          StringValue: decoratedMethodName,
        },
        TIMESTAMP: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      })
      return returnedValue
    }
    return descriptor
  }
}
