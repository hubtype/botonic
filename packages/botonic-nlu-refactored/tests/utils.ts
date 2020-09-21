import { BotonicNLU } from '../src';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { Locale } from '../src/types';
import {
  UTTERANCES_DIR,
  NLU_DIR,
  EXTENSIONS,
  ENCODINGS,
} from '../src/constants';

export const BOOKRESTAURANT_UTTERANCES_LENGTH = 62;
export const GETDIRECTIONS_UTTERANCES_LENGTH = 55;
export const GRATITUDE_UTTERANCES_LENGTH = 9;
export const GREETINGS_UTTERANCES_LENGTH = 12;

export const initFromDirectory = (filterBy: Locale): BotonicNLU => {
  const utterancesPath = join(__dirname, NLU_DIR, UTTERANCES_DIR);
  const pathLangs = readdirSync(utterancesPath).filter(
    (locale) => locale == filterBy,
  );
  const nlu = new BotonicNLU();
  pathLangs.forEach((locale: Locale) => {
    const intentsForLang = readdirSync(join(utterancesPath, locale));
    intentsForLang.forEach((filename) => {
      const intent = filename.replace(EXTENSIONS.TXT, '');
      const utterances = readFileSync(
        join(utterancesPath, locale, filename),
        ENCODINGS.UTF8,
      ).split('\n');
      utterances.forEach((utterance) => {
        nlu.addExample({ locale, intent, utterance });
      });
    });
  });
  return nlu;
};
