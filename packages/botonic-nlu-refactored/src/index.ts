// import { BotonicNLU } from './botonic-nlu';
import { NewBotonicNLU } from './new-botonic-nlu';
// export { BotonicNLU };
export { NewBotonicNLU };
/*  
// DEV (useful for development workflow)
// NOTE: Do not add them when building the project to avoid generating more transpiled modules than necessary
// Uncomment below lines to work with tsc watcher: 'npm run start:dev'
*/

// import * as natural from 'natural';
// import * as tf from '@tensorflow/tfjs-node';
// import { initFromDirectory } from '../tests/utils';
// import { join } from 'path';
// import { UTTERANCES_DIR, NLU_DIR, MODELS_DIR } from './constants';

// (async (): Promise<void> => {
//   //   const nlu = new BotonicNLU();
//   //   console.log(nlu);
//   //   const EN_LOCALE = 'en';
//   //   const nlu = initFromDirectory(EN_LOCALE);
//   //   const trainer = nlu
//   //     .train(EN_LOCALE)
//   //     .withTokenizer(new natural.TreebankWordTokenizer())
//   //     .withParams({ learningRate: 0.03 })
//   //     .withWordEmbeddings({ kind: 'glove', dimension: 50, trainable: false });
//   //   console.debug('RUNNING WITH PARAMS:', trainer.params);
//   //   const weMatrix = await trainer.getEmbeddingMatrix();
//   //   const model = tf.sequential();
//   //   model.add(
//   //     tf.layers.embedding({
//   //       inputDim: weMatrix.shape[0],
//   //       outputDim: weMatrix.shape[1],
//   //       inputLength: trainer.sequenceLength,
//   //       trainable: trainer.embeddings.trainable,
//   //       weights: [weMatrix],
//   //     }),
//   //   );
//   //   model.add(
//   //     tf.layers.lstm({
//   //       units: trainer.params.units,
//   //       dropout: trainer.params.dropoutRegularization,
//   //       recurrentDropout: trainer.params.dropoutRegularization,
//   //     }),
//   //   );
//   //   model.add(
//   //     tf.layers.dense({
//   //       units: Object.keys(trainer.reversedLabels).length,
//   //       activation: 'softmax',
//   //     }),
//   //   );
//   //   model.summary();
//   //   model.compile({
//   //     optimizer: tf.train.adam(trainer.params.learningRate),
//   //     loss: 'categoricalCrossentropy',
//   //     metrics: ['accuracy'],
//   //   });
//   //   await trainer.run(model);
//   //   const resultsPath = join(
//   //     process.cwd(),
//   //     'tests',
//   //     NLU_DIR,
//   //     MODELS_DIR,
//   //     EN_LOCALE,
//   //   );
//   //   trainer.save();
//   //   // trainer.predict('How can i reach the park?');
// })();
