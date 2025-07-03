import { MessagesAnnotation } from '@langchain/langgraph'
import { AIMessage } from '@langchain/core/messages'

export const shouldContinue = (
  state: typeof MessagesAnnotation.State
): string => {
  console.log('Conditional edge: shouldContinue')
  const lastMessage = state.messages.at(-1) as AIMessage
  if (
    lastMessage.tool_calls &&
    lastMessage.tool_calls.length == 1 &&
    lastMessage.tool_calls[0].name == 'weatherResponse'
  ) {
    return 'respond'
  } else {
    return 'tools'
  }
}
