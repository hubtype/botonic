import nluConfig from './nlu/nlu.config.json'
export const plugins = [
  {
    id: 'nlu',
    resolve: require('@botonic/plugin-nlu'),
    options: nluConfig
  }
]
