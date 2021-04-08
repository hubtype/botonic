import { LabelEncoder } from '../../../../src/encode/label-encoder'
import { Preprocessor } from '../../../../src/preprocess'
import { CLASSES, LOCALE, MAX_LENGTH, VOCABULARY } from './constants-helper'

export const preprocessor = new Preprocessor(LOCALE, MAX_LENGTH)

export const tokensEncoder = new LabelEncoder(VOCABULARY)
export const classEncoder = new LabelEncoder(CLASSES)
