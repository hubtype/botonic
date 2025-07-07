import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { AIMessage, BaseMessage, SystemMessage } from '@langchain/core/messages'
import { StructuredTool } from '@langchain/core/tools'
import {
  Annotation,
  END,
  messagesStateReducer,
  START,
  StateGraph,
} from '@langchain/langgraph'
import { ToolNode } from '@langchain/langgraph/prebuilt'

import { finishConversation, outOfContext } from './tools/exit'
import { messageResponse } from './tools/message'

export function createHubtypeAIAgent(
  llm: BaseChatModel,
  tools: StructuredTool[],
  instructions: string
) {
  const llmWithTools =
    llm.bindTools?.(tools, {
      tool_choice: 'any',
    }) || llm

  const AgenticState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: messagesStateReducer,
      default: () => [new SystemMessage(instructions)],
    }),
    output: Annotation<Record<string, any>>(),
  })

  const callModel = async (state: typeof AgenticState.State) => {
    console.log('Node: callModel')
    console.log(state.messages)
    const response = await llmWithTools.invoke(state.messages)
    return { messages: [response] }
  }

  const respond = async (state: typeof AgenticState.State) => {
    console.log('Node: respond')
    const lastMessage = state.messages.at(-1) as AIMessage
    const toolCalls = lastMessage.tool_calls || []
    if (toolCalls.length == 1 && toolCalls[0].name == 'messageResponse') {
      return { output: toolCalls[0].args.messages }
    }
    return {}
  }

  const exit = async (_state: typeof AgenticState.State) => {
    console.log('Node: exit')
    return { output: [{ type: 'exit' }] }
  }

  const shouldContinue = (state: typeof AgenticState.State): string => {
    console.log('Conditional edge: shouldContinue')
    const lastMessage = state.messages.at(-1) as AIMessage

    if (lastMessage.tool_calls?.length != 1) {
      return 'tools'
    }

    switch (lastMessage.tool_calls[0].name) {
      case outOfContext.name:
      case finishConversation.name:
        return 'exit'
      case messageResponse.name:
        return 'respond'
      default:
        return 'tools'
    }
  }

  const workflow = new StateGraph(AgenticState)
    .addNode('agent', callModel)
    .addNode('tools', new ToolNode(tools))
    .addNode('respond', respond)
    .addNode('exit', exit)
    .addEdge(START, 'agent')
    .addConditionalEdges('agent', shouldContinue, ['respond', 'tools', 'exit'])
    .addEdge('tools', 'agent')
    .addEdge('respond', END)
    .addEdge('exit', END)

  return workflow.compile()
}
