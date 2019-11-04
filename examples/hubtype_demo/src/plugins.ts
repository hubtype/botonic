import * as contentful from '@botonic/plugin-contentful'
import { ContentfulConfig } from './config'

const CONFIG = new ContentfulConfig()

export const plugins = [
  {
    id: 'contentful',
    resolve: contentful,
    options: CONFIG as any
  }
]
