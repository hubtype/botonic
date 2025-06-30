import { MESSAGE_TOOLS } from './message'
import { EXIT_TOOLS } from './exit'

export const EXIT_TOOLS_NAMES = EXIT_TOOLS.map(tool => tool.name)
export const MANDATORY_TOOLS = [...MESSAGE_TOOLS, ...EXIT_TOOLS]
