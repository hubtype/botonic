import { WebviewApp } from '@botonic/react'

import { locales } from '../src/locales'
import { webviews } from '../src/webviews'

export const app = new WebviewApp({ webviews, locales })
