import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import { BotonicProject } from './interfaces.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const exampleTestPath = path.resolve(__dirname, '..', '..', '..', 'examples')
const exampleVersion = '0.41.0'

export const EXAMPLES: BotonicProject[] = [
  {
    name: 'blank',
    description: 'Blank: A minimal template to start from scratch',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'blank'),
  },
  {
    name: 'blank-typescript',
    description: 'Blank (TypeScript): A minimal template to start from scratch',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'blank-typescript'),
  },
  {
    name: 'flow-builder-typescript',
    description:
      'Flow Builder (TypeScript): A minimal template to start from scratch',
    version: exampleVersion,
    localTestPath: path.resolve(exampleTestPath, 'flow-builder-typescript'),
  },
]
