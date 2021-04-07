import { Preprocessor } from '@botonic/nlp/lib/preprocess/preprocessor'

import { LOCALE, MAX_LENGTH } from './constants-helper'

export const preprocessor = new Preprocessor(LOCALE, MAX_LENGTH)
