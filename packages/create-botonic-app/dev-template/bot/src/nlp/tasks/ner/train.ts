import {
  BotonicNer,
  DatabaseStorage,
  Dataset,
  NER_TEMPLATE,
  Preprocessor,
} from '@botonic/nlp' // eslint-disable-line node/no-missing-import, import/no-unresolved
import { join } from 'path'

const LOCALE = 'en'

const DATASET_DIR_PATH = join(process.cwd(), 'src', 'nlp', 'data', LOCALE)
const MODEL_DIR_PATH = join(
  process.cwd(),
  'src',
  'nlp',
  'tasks',
  'ner',
  'models'
)

const MAX_SEQUENCE_LENGTH = 12
const EMBEDDINGS_DIMENSION = 50
const EMBEDDINGS_TYPE = 'glove'
const EPOCHS = 4
const BATCH_SIZE = 8

const dataset = Dataset.load(DATASET_DIR_PATH)
const { trainSet, testSet } = dataset.split()

const preprocessor = new Preprocessor(LOCALE, MAX_SEQUENCE_LENGTH)
const vocabulary = trainSet.extractVocabulary(preprocessor)

const trainModel = async () => {
  const recognizer = new BotonicNer(
    {
      locale: LOCALE,
      maxLength: MAX_SEQUENCE_LENGTH,
      entities: dataset.entities,
      vocabulary,
    },
    preprocessor
  )

  const model = await recognizer.createModel(
    NER_TEMPLATE.BILSTM,
    await DatabaseStorage.with(LOCALE, EMBEDDINGS_TYPE, EMBEDDINGS_DIMENSION)
  )

  recognizer.setModel(model)

  await recognizer.train(trainSet, EPOCHS, BATCH_SIZE)

  const { accuracy, loss } = await recognizer.evaluate(testSet)
  console.log(`Test Accuracy: ${accuracy}`)
  console.log(`Test loss: ${loss}`)

  await recognizer.saveModel(MODEL_DIR_PATH)
}

trainModel()
