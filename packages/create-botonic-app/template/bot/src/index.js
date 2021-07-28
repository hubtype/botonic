import { NodeApp } from '@botonic/react'

import { locales } from './locales'
import { plugins } from './plugins'
import { routes } from './routes'

const config = { defaultDelay: 0, defaultTyping: 0 }
export const app = new NodeApp({ routes, locales, plugins, ...config })
