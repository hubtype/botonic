import { WebviewApp } from '@botonic/react'

import { webviews } from '../src/client/webviews'
import { locales } from '../src/shared/locales'

export const app = new WebviewApp({ webviews, locales })
