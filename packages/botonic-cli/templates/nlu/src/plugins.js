import nluConfig from './nlu.config.json'
export const plugins = [
  {
    id: 'nlu',
    resolve: require('@botonic/plugin-nlu'),
    options: nluConfig
  }
]
