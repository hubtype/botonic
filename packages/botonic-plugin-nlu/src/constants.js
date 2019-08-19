// Filenames
export const NLU_DATA_FILENAME = 'nlu-data.json'
export const MODEL_FILENAME = 'model.json'
// Dirnames
export const MODELS_DIRNAME = 'models'
export const UTTERANCES_DIRNAME = 'utterances'
// Subpaths
export const NLU_DIRNAME = 'nlu'
export const NLU_CONFIG_FILENAME = 'nlu.config.json'
export const WORD_EMBEDDINGS_PATH = '/.botonic/word_embeddings'
// General Config
export const UTTERANCES_EXTENSION = '.txt'
export const ASSETS_DIRNAME = 'assets'
export const UNKNOWN_TOKEN = '<UNK>'
export const DB = {
  TABLE: 'embeddings',
  COLUMN: 'token'
}

//Entities
export const ENTITIES_REGEX = /\[(.*?)\]\((.*?)\)/
export const COMPROMISE_DEFAULT_ENTITIES = [
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
