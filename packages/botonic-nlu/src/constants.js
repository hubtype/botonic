// Filenames
export const NLU_DATA_FILENAME = 'nlu-data.json'
export const MODEL_FILENAME = 'model.json'
// Dirnames
export const MODELS_DIRNAME = 'models'
export const UTTERANCES_DIRNAME = 'utterances'
// Subpaths
export const NLU_DIRNAME = 'nlu'
export const NLU_CONFIG_FILENAME = 'nlu.config.json'
export const GLOBAL_CONFIG_DIRNAME = '.botonic'
export const WORD_EMBEDDINGS_DIRNAME = 'word-embeddings'

// General Config
export const UTTERANCES_EXTENSION = '.txt'
export const ASSETS_DIRNAME = 'assets'
export const UNKNOWN_TOKEN = '<UNK>'
export const DB = {
  TABLE: 'embeddings',
  COLUMN: 'token'
}
export const WORD_EMBEDDDINGS_ENDPOINT =
  'https://s3-eu-west-1.amazonaws.com/word-embeddings.hubtype.com'

//Entities
export const ENTITIES_REGEX = /\[(.*?)\]\((.*?)\)/
export const GLOBAL_ENTITIES_REGEX = /\[(.*?)\]\((.*?)\)/g
export const DEFAULT_ENTITIES = [
  // Nouns
  'Organization',
  'Currency',
  'Unit',
  // Places
  'Country',
  'Region',
  'Place',
  'City',
  // Dates
  'WeekDay',
  'Date',
  'Holiday',
  'Month',
  'Duration',
  'Time',
  // People
  'FirstName',
  'LastName',
  'MaleName',
  'FemaleName',
  'Honorific',
  'Person'
]

export const DEFAULT_HYPERPARAMETERS = {
  EMBEDDING: '10k-fasttext',
  EMBEDDING_DIM: 300,
  TRAINABLE_EMBEDDINGS: true,
  LEARNING_RATE: 0.03,
  EPOCHS: 10,
  UNITS: 21,
  MAX_SEQ_LENGTH: 50,
  VALIDATION_SPLIT: 0.2,
  DROPOUT_REG: 0.2
}
