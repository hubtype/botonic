import { Intent, Utterance, Locale, Data, Example } from './types';
import { isEmptyString } from './util/object-tools';
import { Trainer } from './trainer';
export class BotonicNLU {
  private readonly _data: Data;
  _trainers: Trainer[];

  constructor() {
    this._data = {};
    this._trainers = [];
  }

  get data(): Data {
    return this._data;
  }

  get locales(): Locale[] {
    return Object.keys(this._data) as Locale[];
  }

  private _addLocale(locale: Locale): void {
    if (!(locale in this._data)) this._data[locale] = {};
  }

  private _addIntent(intent: Intent, locale: Locale): void {
    if (!(intent in this._data[locale])) this._data[locale][intent] = [];
  }

  private _addUtterance(
    newUtterance: Utterance,
    intent: Intent,
    locale: Locale,
  ): void {
    if (isEmptyString(newUtterance)) return;
    if (
      this._data[locale][intent].some((utterance) => utterance == newUtterance)
    )
      return;
    this._data[locale][intent].push(newUtterance);
  }

  addExample(example: Example): void {
    const { locale, intent, utterance } = example;
    this._addLocale(locale);
    this._addIntent(intent, locale);
    this._addUtterance(utterance, intent, locale);
  }

  train(locale: Locale): Trainer {
    const trainer = new Trainer(locale, this._data[locale]);
    this._trainers.push(trainer);
    return trainer;
  }
}
