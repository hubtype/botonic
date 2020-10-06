import {
  Intent,
  Utterance,
  Locale,
  Data,
  Example,
  TokenizerLike,
} from './types';
import { isEmptyString } from './util/object-tools';
import { Trainer } from './trainer';
import { join } from 'path';
import {
  ENCODINGS,
  EXTENSIONS,
  NLU_DIRNAME,
  UTTERANCES_DIRNAME,
} from './constants';
import { readdirSync, readFileSync } from 'fs';

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

  loadFromUtterances(path?: string): void {
    const utterancesPath =
      path || join(process.cwd(), NLU_DIRNAME, UTTERANCES_DIRNAME);
    const pathLangs = readdirSync(utterancesPath);
    pathLangs.forEach((locale: Locale) => {
      const intentsForLang = readdirSync(join(utterancesPath, locale));
      intentsForLang.forEach((filename) => {
        const intent = filename.replace(EXTENSIONS.TXT, '');
        const utterances = readFileSync(
          join(utterancesPath, locale, filename),
          ENCODINGS.UTF8,
        ).split('\n');
        utterances.forEach((utterance) => {
          this.addExample({ locale, intent, utterance });
        });
      });
    });
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

  async loadModel(
    locale: Locale,
    pathToModel: string,
    tokenizer: TokenizerLike,
  ): Promise<Trainer> {
    const modelsPath = join(pathToModel, locale);
    const modelPath = join(modelsPath, 'model.json');
    const nluDataPath = join(modelsPath, 'nlu-data.json');
    const trainer = Trainer._loadModel(
      locale,
      modelPath,
      nluDataPath,
      tokenizer,
    );
    return trainer;
  }
}
