import * as Parallel from 'async-parallel'
import { MultiError } from 'async-parallel'

import { Context } from '../cms/context'

/**
 * async-parallel makes code simpler and allows limiting concurrency
 */

export async function asyncMap<T1, T2>(
  context: Context,
  list: T1[],
  action: {
    (value: T1, index: number, list: T1[]): Promise<T2>
  },
  concurrency?: number,
  errorTreatment?: (value: T1, e: any) => T2 | undefined
): Promise<T2[]> {
  const result = await Parallel.map(
    list,
    resumable(action, errorTreatment),
    concurrency || context.concurrency
  )
  return result.filter((i): i is T2 => i !== undefined)
}

type AsyncMapFunction<T1, T2> = (
  value: T1,
  index: number,
  list: T1[]
) => Promise<T2 | undefined>

export function resumable<T1, T2 = T1>(
  action: AsyncMapFunction<T1, T2>,
  errorTreatment?: (input: T1, e: any) => T2 | undefined
): AsyncMapFunction<T1, T2 | undefined> {
  const wrapped = async (value: T1, index: number, list: T1[]) => {
    try {
      return await action(value, index, list)
    } catch (e) {
      if (errorTreatment) {
        return errorTreatment(value, e)
      }
      throw e
    }
  }
  return wrapped
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
