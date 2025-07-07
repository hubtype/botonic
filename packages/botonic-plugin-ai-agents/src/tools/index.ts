import { EXIT_TOOLS } from './exit'
import { messageResponse } from './message'

export const EXIT_TOOLS_NAMES = EXIT_TOOLS.map(tool => tool.name)
export const MANDATORY_TOOLS = [messageResponse, ...EXIT_TOOLS]
