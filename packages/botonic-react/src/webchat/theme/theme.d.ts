import 'styled-components'

import { WebchatTheme } from './types'

// With this declaration, we can use the theme prop in styled components with TypeScript defined in WebchatTheme
declare module 'styled-components' {
  export interface DefaultTheme extends WebchatTheme {}
}
