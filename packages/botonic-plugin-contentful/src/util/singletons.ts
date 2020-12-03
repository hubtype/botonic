export class Singleton<T> {
  private factoryOutput: T | undefined
  private isValueSet = false

  constructor(private readonly factory: () => T) {}

  get value(): T {
    if (!this.isValueSet) {
      this.factoryOutput = this.factory()
      this.isValueSet = true
    }
    return this.factoryOutput!
  }
}

/**
 * Singletons dictionary accessible through a string
 */
export class SingletonMap<T> {
  private readonly map: { [key: string]: Singleton<T> } = {}

  constructor(map: { [key: string]: () => T }) {
    for (const [k, v] of Object.entries(map)) {
      this.map[k] = new Singleton<T>(v)
    }
  }

  value(key: string): T {
    const lazy = this.map[key]
    if (!lazy) {
      throw new Error(`No factory for key ${key}`)
    }
    return lazy.value
  }
}

/**
 * Given a factory function (string) => T,
 * it ensures that we don't invoke it more than once per each input value
 */
export class DynamicSingletonMap<T> {
  private readonly values: { [key: string]: T } = {}

  constructor(private readonly factories: (key: string) => T) {}

  value(key: string): T {
    if (!(key in this.values)) {
      const val = this.factories(key)
      this.values[key] = val
      return val
    }
    return this.values[key]
  }
}
