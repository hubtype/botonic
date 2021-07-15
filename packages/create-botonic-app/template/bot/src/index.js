import { NodeApp } from '@botonic/react'
import { routes } from './routes'
import { plugins } from './plugins'
import { locales } from './locales'

export const config = { defaultDelay: 0, defaultTyping: 0 }
export let app = new NodeApp({ routes, locales, plugins, ...config })
