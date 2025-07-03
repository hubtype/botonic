import { AgenticState } from './state'
import { AIMessage } from '@langchain/core/messages'

export const shouldContinue = (state: typeof AgenticState.State): string => {
  console.log('Conditional edge: shouldContinue')
  const lastMessage = state.messages.at(-1) as AIMessage
  if (
    lastMessage.tool_calls &&
    lastMessage.tool_calls.length == 1 &&
    lastMessage.tool_calls[0].name == 'messageResponse'
  ) {
    return 'respond'
  } else {
    return 'tools'
  }
}
