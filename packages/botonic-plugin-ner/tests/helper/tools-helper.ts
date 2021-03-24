import { Codifier } from '@botonic/nlp/dist/preprocess/codifier'
import { Preprocessor } from '@botonic/nlp/dist/preprocess/preprocessor'

import { LOCALE, MAX_LENGTH, VOCABULARY } from './constants-helper'

export const preprocessor = new Preprocessor(LOCALE, MAX_LENGTH)
export const tokenCodifier = new Codifier(VOCABULARY, { isCategorical: false })
