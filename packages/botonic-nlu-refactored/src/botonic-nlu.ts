import { Intent, Utterance, Language, Data, Example } from './types';
import { isEmptyString } from './util/object-tools';
import { Trainer } from './trainer';
import { csvParse, local } from 'd3';
import { readFileSync } from 'fs';

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

  get locales(): Language[] {
    return Object.keys(this._data) as Language[];
  }

  private _addLocale(locale: Language): void {
    if (!(locale in this._data)) this._data[locale] = {};
  }

  private _addIntent(intent: Intent, locale: Language): void {
    if (!(intent in this._data[locale])) this._data[locale][intent] = [];
  }

  private _addUtterance(
    newUtterance: Utterance,
    intent: Intent,
    locale: Language,
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

  train(locale: Language): Trainer {
    const trainer = new Trainer(locale, this._data[locale]);
    this._trainers.push(trainer);
    return trainer;
  }

  loadData(path: string, locale: Language): void {
    const extension = path.split('.').pop();
    if (extension == 'csv') {
      this._readCSV(path, locale);
    }
  }

  private _readCSV(path: string, locale: Language): void {
    const text = readFileSync(path, 'utf-8');
    const data = csvParse(text);
    data.map((example) => {
      this.addExample({
        locale: locale,
        intent: example.intent,
        utterance: example.sentence,
      });
    });
  }

  split_data(data: Data, test_prop: number) {
    console.log(test_prop);
  }
}
