import { EXIT_TOOLS } from './exit'
import { MESSAGE_TOOLS } from './message'

export const EXIT_TOOLS_NAMES = EXIT_TOOLS.map(tool => tool.name)
export const MANDATORY_TOOLS = [...MESSAGE_TOOLS, ...EXIT_TOOLS]
