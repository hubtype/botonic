import {
  Dataset,
  DatabaseStorage,
  BotonicIntentClassifier,
  Preprocessor,
  INTENT_CLASSIFIER_TEMPLATE,
} from '@botonic/nlp'
import { join } from 'path'

const LOCALE = 'en'

const DATASET_DIR_PATH = join(process.cwd(), 'src', 'nlp', 'data', LOCALE)
const MODEL_DIR_PATH = join(
  process.cwd(),
  'src',
  'nlp',
  'tasks',
  'intent-classification',
  'models'
)

const MAX_SEQUENCE_LENGTH = 12
const EMBEDDINGS_DIMENSION = 50
const EMBEDDINGS_TYPE = 'glove'
const EPOCHS = 4
const BATCH_SIZE = 8

const dataset = Dataset.load(DATASET_DIR_PATH)

console.log(`Dataset size: ${dataset.length}`)

const { trainSet, testSet } = dataset.split()
console.log(`Train set size: ${trainSet.length}`)
console.log(`Test set size: ${testSet.length}`)

const preprocessor = new Preprocessor(LOCALE, MAX_SEQUENCE_LENGTH)

const vocabulary = trainSet.extractVocabulary(preprocessor)

const trainModel = async () => {
  const classifier = new BotonicIntentClassifier(
    {
      locale: LOCALE,
      maxLength: MAX_SEQUENCE_LENGTH,
      intents: dataset.intents,
      vocabulary,
    },
    preprocessor
  )

  const model = await classifier.createModel(
    INTENT_CLASSIFIER_TEMPLATE.SIMPLE_NN,
    await DatabaseStorage.with(LOCALE, EMBEDDINGS_TYPE, EMBEDDINGS_DIMENSION),
    { units: 128, dropout: 0.6 }
  )

  classifier.setModel(model)

  await classifier.train(trainSet, EPOCHS, BATCH_SIZE)

  const { accuracy, loss } = await classifier.evaluate(testSet)
  console.log(`Test Accuracy: ${accuracy}`)
  console.log(`Test loss: ${loss}`)

  await classifier.saveModel(MODEL_DIR_PATH)
}

trainModel()
