# Botonic NLU

## What Does Botonic NLU Do?

Botonic NLU is a natural language understanding engine written in Typescript for Node.js, based on [tfjs](https://js.tensorflow.org/api/latest/) that allows you to train an intent classification model with your own dataset of utterances.

## Use

### Define your dataset of utterances

You can load your dataset with Botonic NLU from two different sources:

- A folder containing one file per intent with the following format: `IntentName.txt`. **Important:** Each file has to contain one sentence per line.

  > **E.g:**

  **Greetings.txt**

  ```
  Hello!
  hi
  good morning
  ```

  **Farewell.txt**

  ```
  Bye
  Goodbye
  see you soon!
  ```

- A CSV file containing each sentence under a column named `features` and each intent under a column named `label`. **Important:** Separator can be specified when reading the data.

  > **E.g:**

  **data.csv**

  ```
  features, label
  Hello!, Greetings
  hi, Greetings
  good morning, Greetings
  Bye, Farewell
  Goodbye, Farewell
  see you soon!, Farewell
  ```

### Train your model

Once you have defined your dataset, you can import `BotonicNLU` in order to load it in memory, train and save your model.

**train-model.ts**

```ts
import { BotonicNLU, CONSTANTS, ModelTemplatesType } from '@botonic/nlu'

const nlu = new BotonicNLU()

const dataPath = `path/to/your/dataset-directory/`
// or alternatively
// const dataPath = 'path/to/your/dataset/file.csv'

const data = nlu.readData(
  {
    path: dataPath,
    language: 'en',
    maxSeqLen: 20,
  },
  { csvSeparator: ',' }
)

const [xTrain, xTest, yTrain, yTest] = nlu.trainTestSplit({
  data: data,
  testPercentage: 0.2,
})

;(async () => {
  await nlu.createModel({
    template: ModelTemplatesType.SIMPLE_NN,
    learningRate: 0.01,
  })
  await nlu.train(xTrain, yTrain, { epochs: 10 })
  const accuracy = await nlu.evaluate(xTest, yTest)
  console.log('Accuracy:', accuracy)
  await nlu.saveModel('path/to/models-directory/')
  console.log('Model saved.')
  nlu.predict('good afternoon') // --> Will return the intent prediction
})()
```

### Train your custom model

If you have some deep learning knowledge, you can also implement your own neural network model with the [tfjs API](https://js.tensorflow.org/api/latest/).

**train-model.ts**

```ts
import { BotonicNLU } from '@botonic/nlu'
import { join } from 'path'
import { tokenizer } from './preprocessing-tools/tokenizer'
import {
  sequential,
  Sequential,
  LayersModel,
  train,
  layers,
} from '@tensorflow/tfjs-node'

function createCustomModel(maxSeqLen: number): Sequential | LayersModel {
  const model = sequential()
  model.add(layers.inputLayer({ inputShape: [maxSeqLen] })) // input must be the same as maxSeqLen
  model.add(layers.dense({ units: 128, activation: 'relu' }))
  model.add(layers.dense({ units: 3, activation: 'softmax' }))
  model.compile({
    optimizer: train.adam(5e-3),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy'],
  })
  model.summary()
  return model
}

const nlu = new BotonicNLU({ tokenizer: tokenizer })

const data = nlu.readData(
  {
    path: dataPath,
    language: 'en',
    maxSeqLen: 20,
  },
  { csvSeparator: ',' }
)

const [xTrain, xTest, yTrain, yTest] = nlu.trainTestSplit({
  data: data,
  testPercentage: 0.1,
  stratify: true,
})

nlu.model = createCustomModel(20)
;(async () => {
  await nlu.train(xTrain, yTrain, { epochs: 8 })
  await nlu.saveModel()
  console.log('Model saved.')
})()
```

## Botonic NLU API

### Initialization

```ts
constructor({ normalizer, tokenizer, stemmer }: ?{
  normalizer?: Normalizer;
  tokenizer?: Tokenizer;
  stemmer?: Stemmer;
})
```

An instance of Botonic NLU can be initialized with default preprocessing engines by passing an empty object.

> **E.g:**

```ts
const nlu = new BotonicNLU()
```

Alternatively, BotonicNLU can be initialized with your own preprocessing engines. Each of these **must** be a class or object implementing the corresponding methods:

- **Normalizer**: transforms text into a single canonical form that guarantees consistency before applying more data preprocessing.

```ts
interface Normalizer {
  normalize(sentence: string): string
}
```

- **Tokenizer**: splits the text into smaller units called tokens.

```ts
interface Tokenizer {
  tokenize(sentence: string): string[]
}
```

- **Stemmer**: reduces a word to its stem or root format.

```ts
interface Stemmer {
  stem(token: string, language: Language): string
}
```

> **E.g:**

```ts
class CustomTokenizer {
  tokenize(sentence: string): string {
    return sentence.split(' ')
  }
}

const nlu = new BotonicNLU({ tokenizer: new CustomTokenizer() })
```

### Dealing with data

Botonic NLU works internally with the following structure for data:

```ts
type DataSet = {
  label: string
  feature: string
}[]
```

---

#### **BotonicNLU.readData**

It reads your data and converts it into the default structure.

```ts
readData(options: {
  path: string;
  language: Language;
  maxSeqLen: number;
},
readerConfig?: DataSetReaderConfig
): DataSet
```

Parameters:

- **`options`**:
  - **`path`**: path to your dataset directory (or file).
  - **`language`**: main language of the data.
  - **`maxSeqLen`**: number specifying the maximum length of each sequence of tokens.
- **`readerConfig`**:
  - **`csvSeparator`**: column separator for csv files ('`;`' as default).

Returns:

- _`Dataset`_

> **E.g:**

```ts
const data = nlu.readData({
  path: `path/to/your/dataset-directory/`,
  language: 'en',
  maxSeqLen: 20,
})
```

---

#### **BotonicNLU.trainTestSplit**

It splits the loaded dataset in two sets: one for training the model and the other for testing it.

```ts
trainTestSplit(options: {
  data: DataSet;
  testPercentage: number;
  stratify?: boolean;
}): [InputSet, InputSet, OutputSet, OutputSet];
```

Parameters:

- **`options`**:
  - **`data`**: a variable holding the dataset structure.
  - **`testPercentage`**: a number between 0 and 1 to split the data.
  - **`stratify`**: whether to maintain the data distribution of the different classes.

Returns:

- _`[InputSet, InputSet, OutputSet, OutputSet]`_

> **E.g:**

```ts
const [xTrain, xTest, yTrain, yTest] = nlu.trainTestSplit({
  data: data,
  testPercentage: 0.2,
})
```

### Handling your model

Botonic NLU generates NLU model using neural networks (NN). You can use predefined NN templates or create your own networks based on tfjs.
Once a model has been trained, it will be stored in a directory to enable running new predictions in future sessions. The directory will hold the following information:

> - **model.json**: topology of the neural network.
> - **weights.bin**: weights of the trained model.
> - **model-data.json**: relevant information regarding the training process.

`model-data.json` holds the following information:

```ts
export interface ModelData {
  language: Language
  intents: IntentDecoder
  maxSeqLen: number
  vocabulary: Vocabulary
}
// ... where Vocabulary and IntentDecoder are:
export declare type Vocabulary = {
  [word: string]: number
}
export declare type IntentDecoder = {
  [id: number]: string
}
```

---

#### **BotonicNLU.createModel**

It creates a model from the chosen Botonic NLU Model template.

The available Botonic NLU Model templates are:

- **simple-nn**: a simple Neural Network that uses Word Embeddings to create an embedding layer followed by an LSTM layer.

```ts
createModel(options: {
  template: ModelTemplatesType
  learningRate: number
  wordEmbeddingsType?: WordEmbeddingType
  wordEmbeddingsDimension?: WordEmbeddingDimension
  trainableEmbeddings?: boolean
}): Promise<void>
```

Parameters:

- **`options`**:
  - **`template`**: a constant from `ModelTemplatesType` to load a predefined neural network template.
  - **`learningRate`**: the amount that the weights are updated during training. Typical values range from 0.0001 up to 1.
  - **`wordEmbeddingsType`**: training with `glove` or `fasttext` pretrained embeddings.
  - **`wordEmbeddingsDimension`**: dimension of word embeddings (defaults are `50` for `glove` and `300` for `fasttext`).
  - **`trainableEmbeddings`**: whether the values of word embeddings matrix will be frozen (default is `false`). If you have a large dataset, we suggest you to set this to `false`.

Returns:

- _`Promise<void>`_

> **E.g:**

```ts
import { ModelTemplatesType } from '@botonic/nlu'

await nlu.createModel({
  template: ModelTemplatesType.SIMPLE_NN,
  learningRate: 0.01,
  wordEmbeddingsType: 'glove',
  wordEmbeddingsDimension: 50,
  trainableEmbeddings: true,
})
```

---

#### **BotonicNLU.model**

Set your own [tfjs](https://js.tensorflow.org/api/latest/) model to train.

```ts
set model(model: Sequential | LayersModel)
```

Parameters:

- **`model`**: a [tf.sequential](https://js.tensorflow.org/api/latest/#sequential) model or a [tf.model](https://js.tensorflow.org/api/latest/#model) model.

Returns:

- _`void`_

> **E.g:**

```ts
const nlu = new BotonicNLU()

const myCustomModel = tf.sequential()
myCustomModel.add(tf.layers.dense({ units: 32, inputShape: [50] }))
myCustomModel.add(tf.layers.dense({ units: 4 }))

nlu.model = myCustomModel
```

> **E.g:**

```ts
const nlu = new BotonicNLU()

const input = tf.input({shape: [5]});
const denseLayer1 = tf.layers.dense({units: 10, activation: 'relu'});
const denseLayer2 = tf.layers.dense({units: 4, activation: 'softmax'});
.
const output = denseLayer2.apply(denseLayer1.apply(input));
const myCustomModel = tf.model({inputs: input, outputs: output})

nlu.model = myCustomModel
```

---

#### **BotonicNLU.loadModel**

It allows you to load a previously trained model.

```ts
loadModel(modelPath: string, modelDataPath: string): Promise<void>
```

Parameters:

- **`modelPath`**: path to `model.json`.
- **`modelDataPath`**: path to `model-data.json`.

Returns:

- _`Promise<void>`_

> **E.g:**

```ts
await nlu.loadModel('path/to/model.json', 'path/to/model-data.json')
```

---

#### **BotonicNLU.saveModel**

Save generated model in the specified path.

```ts
saveModel(path?: string): Promise<void>
```

Parameters:

- **`path`**: path to directory where the model will be stored. _By default will be stored under the directory `/nlu/models/` from within the directory you are running the script._

Returns:

- _`Promise<void>`_

> **E.g:**

```ts
await saveModel('path/to/new-model-directory/')

// or alternatively:
await saveModel()
```

## Methods to train and evaluate your model.

Training and evaluating the model.

---

#### **BotonicNLU.train**

Train a model.

```ts
train(
  x: InputSet,
  y: OutputSet,
  options?: {
    epochs?: number
    batchSize?: number
    validationSplit?: number
  }
): Promise<void>
```

Parameters:

- **`x`**: set of samples to train.
- **`y`**: set of labels to predict.
- **`options`**
  - **`epochs`**: number of times that the learning algorithm will work through the entire training dataset.
  - **`batchSize`**: number of samples that will be propagated through the network.
  - **`validationSplit`**: percentage of ​data used to select the best algorithm during training.

Returns:

- _`Promise<void>`_

> **E.g:**

```ts
const [xTrain, _, yTrain, _] = nlu.trainTestSplit({
  data: data,
  testPercentage: 0.2,
})

await nlu.train(xTrain, yTrain, {
  epochs: 25,
  batchSize: 16,
  validationSplit: 0.1,
})
```

---

#### **BotonicNLU.evaluate**

It evaluates the accuracy of the model over the test set.

```ts
evaluate(x: InputSet, y: OutputSet): number
```

Parameters:

- **`x`**: set of samples to evaluate.
- **`y`**: set of labels to evaluate.

Returns:

- _`number`_: a value between 0 and 1 with the accuracy.

> **E.g:**

```ts
const [_, xTest, _, yTest] = nlu.trainTestSplit({
  data: data,
  testPercentage: 0.2,
})
// Once the model has been trained with nlu.train
const accuracy = await nlu.evaluate(xTest, yTest)
console.log('Accuracy:', accuracy)
```

### Predicting your sentences

Predict results for your model.

---

#### **BotonicNLU.predict**

Predicts the intent related to a given sentence.

```ts
predict(sentence: string): string
```

Parameters:

- **`sentence`**: sentence to predict.

Returns:

- _`string`_: name of the predicted intent.

> **E.g:**

Input:

```ts
// Once the model has been trained with nlu.train
const prediction = nlu.predict('good afternoon!')
console.log(prediction)
```

Output:

```
Greetings
```

---

#### **BotonicNLU.predictProbabilities**

It returns a detailed result for each intent and its corresponding confidence.

```ts
predictProbabilities(sentence: string): DecodedPrediction[]
```

Parameters:

- **`sentence`**: sentence to predict.

Returns:

- _`DecodedPrediction[]`_: array of objects containing the `intentId` and the `confidence`.

Input:

> **E.g:**

```ts
// Once the model has been trained with nlu.train
const predictions = nlu.predictProbabilities('good afternoon!')
console.log(predictions)
```

Output:

```
[
  { intent: 'Farewell', confidence: 0.0120968222600000 },
  { intent: 'Greetings', confidence: 0.9879031777381897 }
]
```
