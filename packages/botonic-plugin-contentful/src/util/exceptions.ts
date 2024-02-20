export function isError(e: any): e is Error {
  const exception = e as Error
  return !!exception.name && !!exception.message
}

export function rethrowDecorator<
  Args extends any[],
  Return,
  F extends (...args: Args) => Promise<Return>,
>(func: F, beforeRethrow: (error: any, ...args: Args) => Promise<void>): F {
  const f = async (...args: Args) => {
    try {
      return await func(...args)
    } catch (e) {
      await beforeRethrow(e, ...args)
      throw e
    }
  }
  return f as F
}
