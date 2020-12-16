export const NLU_DIR = 'nlu'
export const UTTERANCES_DIR = 'utterances'
export const MODELS_DIR = 'models'
export const MODEL_DATA_FILENAME = 'model-data.json'
export const MODEL_FILENAME = 'model.json'
export const ASSETS_DIR = 'assets'

export const UNKNOWN_TOKEN = '<UNK>'

export const WE_DB_FILE = Object.freeze({
  EXTENSION: '.db',
  TABLE_NAME: 'embeddings',
  COLUMN_NAME: 'token',
})

export const BOTONIC_WORD_EMBEDDINGS_URL =
  'https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com'

export const BOTONIC_GLOBAL_DIRNAME = '.botonic'

export const BOTONIC_GLOBAL_WE_DIRNAME = 'word-embeddings'

interface SupportedEmbeddings {
  [locale: string]: { [kind: string]: number[] }
}

export const SUPPORTED_EMBEDDINGS: SupportedEmbeddings = {
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

export const EXTENSIONS = {
  TXT: '.txt',
  JSON: '.json',
}

export const ENCODINGS = {
  UTF8: 'utf-8',
}
