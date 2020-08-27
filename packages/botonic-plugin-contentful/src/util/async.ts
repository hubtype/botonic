import { Context } from '../cms'
import * as Parallel from 'async-parallel'

/**
 * async-parallel makes code simpler and allows limiting concurrency
 */

export function asyncMap<T1, T2>(
  context: Context,
  list: T1[],
  action: {
    (value: T1, index: number, list: T1[]): Promise<T2>
  }
): Promise<T2[]> {
  return Parallel.map(list, action, context.concurrency)
}

export function asyncEach<T1, T2>(
  context: Context,
  list: T1[],
  action: {
    (value: T1): Promise<T2>
  }
): Promise<void> {
  return Parallel.each(list, action, context.concurrency)
}
