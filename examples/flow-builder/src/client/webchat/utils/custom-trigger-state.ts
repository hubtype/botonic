import { LocalState } from './index'

export default class TriggerButtonState extends LocalState {
  private static attributes = {
    FIRST_ANIMATION_SHOWN: 'firstAnimationShown',
  }

  static get firstAnimationShown(): boolean {
    return this.getAttr(this.attributes.FIRST_ANIMATION_SHOWN)
  }

  static setFirstAnimationShown(value: boolean): void {
    this.setAttr(this.attributes.FIRST_ANIMATION_SHOWN, value)
  }
}
