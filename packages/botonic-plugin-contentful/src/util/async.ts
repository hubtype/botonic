import { Context } from '../cms'
import * as Parallel from 'async-parallel'
import { MultiError } from 'async-parallel'

/**
 * async-parallel makes code simpler and allows limiting concurrency
 */

export function asyncMap<T1, T2>(
  context: Context,
  list: T1[],
  action: {
    (value: T1, index: number, list: T1[]): Promise<T2>
  },
  concurrency?: number
): Promise<T2[]> {
  return Parallel.map(list, action, concurrency || context.concurrency)
}

export async function asyncEach<T1, T2>(
  context: Context,
  list: T1[],
  action: {
    (value: T1): Promise<T2>
  },
  concurrency?: number
): Promise<void> {
  concurrency = concurrency || context.concurrency
  await Parallel.each(list, action, concurrency)
}

export function reduceMultiError(error: MultiError): Error[] {
  let reduced: Error[] = []
  for (const e of error.list) {
    if (e instanceof MultiError) {
      reduced = reduced.concat(reduceMultiError(e))
    } else {
      reduced.push(e)
    }
  }
  return reduced
}
