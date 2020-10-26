import { tokenizer } from './nlu/preprocessing-tools/tokenizer'

export const plugins = [
  {
    id: 'nlu',
    resolve: require('@botonic/plugin-nlu'),
    options: {
      en: {
        tokenizer: tokenizer,
      },
    },
  },
]
