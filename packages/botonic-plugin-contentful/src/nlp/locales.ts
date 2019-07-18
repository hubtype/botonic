import { Locale } from './index';
import { stemmerFor } from './stemmer';

export function checkLocale(locale?: Locale): Locale {
  if (!locale) {
    throw new Error('Context.locale must be specified');
  }
  // check it's supported
  stemmerFor(locale);
  return locale;
}
