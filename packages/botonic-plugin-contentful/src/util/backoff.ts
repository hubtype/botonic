export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface Backoff {
  backoff(): Promise<void>
}

export class ExponentialBackoff implements Backoff {
  constructor(
    private startMs = 10,
    private times = 10
  ) {}
  async backoff(): Promise<void> {
    if (this.times <= 0) {
      throw new Error('Aborting exponential backoff')
    }
    await sleep(this.startMs)
    this.startMs *= 2
    this.times++
  }
}

export async function repeatWithBackoff<T>(
  func: () => Promise<T>,
  backoff = new ExponentialBackoff(),
  logger: (msg: string) => void = console.log
): Promise<T> {
  for (;;) {
    try {
      return await func()
    } catch (e: any) {
      const stack = e.stack
        ? `\nat:\n${String(e.stack)}`
        : ' (no stack available)'
      logger(
        `Retrying after exception at ${new Date().toISOString()}: ${String(
          e
        )}` + stack
      )
      await backoff.backoff()
    }
  }
}
