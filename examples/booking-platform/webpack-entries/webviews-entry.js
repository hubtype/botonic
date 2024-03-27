import { WebviewApp } from '@botonic/react'
import { webviews } from '../src/webviews'
import { locales } from '../src/locales'

export const app = new WebviewApp({ webviews, locales })
