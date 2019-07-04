import { CallbackMap, Language } from './callback';

export class Context {
  /** TODO make DEFAULT's callback immutable*/
  static DEFAULT = new Context();
  constructor(
    readonly callbacks = new CallbackMap(),
    readonly language?: Language
  ) {}
}
