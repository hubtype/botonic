import { PluginConfig } from '@botonic/core'

import { CONFIG } from './config'
import * as PreHandoffPlugin from './plugins/pre-handoff'
import { getEnvironment } from './utils/env-utils'

const config = CONFIG[getEnvironment()]

export const plugins: PluginConfig<any>[] = [
  {
    id: 'flowBuilder',
    resolve: require('@botonic/plugin-flow-builder'),
    options: config.flowBuilder,
  },
  {
    id: 'hubtypeAnalytics',
    resolve: require('@botonic/plugin-hubtype-analytics'),
  },
  {
    id: 'preHandoff',
    resolve: PreHandoffPlugin,
  },
  {
    id: 'knowledgeBases',
    resolve: require('@botonic/plugin-knowledge-bases'),
    options: config.knowledgeBases,
  },
]
