export class LocalState {
  protected static storageKey = 'botonicLocalState'

  static getAttr(attr: string): any {
    const storage = sessionStorage.getItem(this.storageKey) as string
    const state = JSON.parse(storage) || {}
    return state[attr]
  }

  static setAttr(attr: string, value: any): void {
    const storage = sessionStorage.getItem(this.storageKey) as string
    const state = JSON.parse(storage) || {}
    state[attr] = value
    sessionStorage.setItem(this.storageKey, JSON.stringify(state))
  }
}
