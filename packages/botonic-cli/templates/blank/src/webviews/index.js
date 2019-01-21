import { WebviewApp } from '@botonic/react'

import { locales } from '../locales'
import MyWebview from './myWebview'

const webviews = [MyWebview]

export default new WebviewApp({ webviews, locales })
