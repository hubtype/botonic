export class InMemoryStorage {
  items

  constructor() {
    this.items = {}
  }

  clear() {
    this.items = {}
  }

  getItem(key) {
    return this.items[key] ?? null
  }

  key(index) {
    return Object.keys(this.items)[index] ?? null
  }

  removeItem(key) {
    delete this.items[key]
  }

  setItem(key, value) {
    this.items[key] = value
  }
}
