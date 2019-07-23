import nluConfig from './nlu.config.json'
export const plugins = [
  {
    id: 'nlu',
    resolve: require('@botonic/plugin-nlu'),
    // in case that the language is undetermined, the first option will be taken as a default lang
    // {
    //   "LANG": "cat",
    //   "ALGORITHM": "glove",
    //   "EMBEDDING_DIM": 50,
    //   "TRAINABLE_EMBEDDINGS": false,
    //   "LEARNING_RATE": 0.01,
    //   "EPOCHS": 10,
    //   "UNITS": 21,
    //   "MAX_SEQ_LENGTH": null,
    //   "VALIDATION_SPLIT": 0.2,
    //   "DROPOUT_REG": 0.2
    // }
    options: nluConfig
  }
]
