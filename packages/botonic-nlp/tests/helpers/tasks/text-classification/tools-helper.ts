import { LabelEncoder } from '../../../../src/encode/label-encoder'
import { OneHotEncoder } from '../../../../src/encode/one-hot-encoder'
import { Preprocessor } from '../../../../src/preprocess'
import { CLASSES, LOCALE, MAX_LENGTH, VOCABULARY } from './constants-helper'

export const preprocessor = new Preprocessor(LOCALE, MAX_LENGTH)

export const tokensEncoder = new LabelEncoder(VOCABULARY)
export const classEncoder = new OneHotEncoder(CLASSES)
