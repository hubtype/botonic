import * as contentful from '@botonic/plugin-contentful'
import { Staging } from './config'

const CONFIG = new Staging()

export const plugins = [
  {
    id: 'contentful',
    resolve: contentful,
    options: CONFIG as any
  }
]
