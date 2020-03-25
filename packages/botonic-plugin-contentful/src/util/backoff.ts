export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface Backoff {
  backoff(): Promise<void>
}

export class ExponentialBackoff implements Backoff {
  constructor(private startMs = 10, private times = 10) {}
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
    } catch (e) {
      logger(`Retrying after exception at ${new Date()}: ${String(e)}`)
      await backoff.backoff()
    }
  }
}
