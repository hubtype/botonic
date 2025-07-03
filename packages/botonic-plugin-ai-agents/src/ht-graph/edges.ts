import { AgenticState } from './state'
import { AIMessage } from '@langchain/core/messages'

export const shouldContinue = (state: typeof AgenticState.State): string => {
  console.log('Conditional edge: shouldContinue')
  const lastMessage = state.messages.at(-1) as AIMessage

  if (lastMessage.tool_calls?.length != 1) {
    return 'tools'
  }

  switch (lastMessage.tool_calls[0].name) {
    case 'outOfContext':
    case 'finishConversation':
      return 'exit'
    case 'messageResponse':
      return 'respond'
    default:
      return 'tools'
  }
}
