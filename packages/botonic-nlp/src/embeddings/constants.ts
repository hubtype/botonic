import { homedir } from 'os'
import { join } from 'path'

import {
  BOTONIC_GLOBAL_DIRNAME,
  BOTONIC_GLOBAL_EMBEDDINGS_DIRNAME,
} from '../constants'

export const SUPPORTED_EMBEDDINGS = {
  en: {
    glove: [50],
    '10k-fasttext': [300],
  },
  ca: {
    '10k-fasttext': [300],
  },
  de: {
    '10k-fasttext': [300],
  },
  es: {
    '10k-fasttext': [300],
  },
  fr: {
    '10k-fasttext': [300],
  },
  hi: {
    '10k-fasttext': [300],
  },
  id: {
    '10k-fasttext': [300],
  },
  it: {
    '10k-fasttext': [300],
  },
  pt: {
    '10k-fasttext': [300],
  },
  ru: {
    '10k-fasttext': [300],
  },
  tr: {
    '10k-fasttext': [300],
  },
  zh: {
    '10k-fasttext': [300],
  },
}

export const GLOBAL_EMBEDDINGS_PATH = join(
  homedir(),
  BOTONIC_GLOBAL_DIRNAME,
  BOTONIC_GLOBAL_EMBEDDINGS_DIRNAME
)
export const EMBEDDINGS_URL =
  'https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com'

export const DB_TABLE_NAME = 'embeddings'
export const DB_COLUMN_NAME = 'token'
