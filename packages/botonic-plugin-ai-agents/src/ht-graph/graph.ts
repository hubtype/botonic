import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import {
  AIMessage,
  SystemMessage,
  HumanMessage,
} from '@langchain/core/messages'
import { StructuredTool } from '@langchain/core/tools'
import {
  END,
  START,
  StateGraph,
  Annotation,
  messagesStateReducer,
} from '@langchain/langgraph'
import { BaseMessage } from '@langchain/core/messages'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { shouldContinue } from './edges'
import { messageResponse, TOOLS } from './tools'
import { llm } from './llm'

export function createHubtypeAIAgent(
  llm: BaseChatModel,
  tools: StructuredTool[],
  prompt: string
) {
  const finalTools = [...tools, messageResponse]
  const llmWithTools =
    llm.bindTools?.(finalTools, {
      tool_choice: 'any',
    }) || llm

  const AgenticState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: messagesStateReducer,
      default: () => [new SystemMessage(prompt)],
    }),
    response: Annotation<Record<string, any>>(),
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
      return { response: toolCalls[0].args }
    }
    return {}
  }

  const workflow = new StateGraph(AgenticState)
    .addNode('agent', callModel)
    .addNode('tools', new ToolNode(TOOLS))
    .addNode('respond', respond)
    .addEdge(START, 'agent')
    .addConditionalEdges('agent', shouldContinue, ['respond', 'tools'])
    .addEdge('tools', 'agent')
    .addEdge('respond', END)

  return workflow.compile()
}

async function main() {
  const agent = createHubtypeAIAgent(
    llm,
    TOOLS,
    'You are a fashion assistant. Before recommending, always ask for extra preferences in order to perform a better recommendation (genre, colors, size, etc.). Ask these preferences one by one by providing a list of buttons. Use rich messages whenever possible to improve the user experience.'
  )
  const response = await agent.invoke({
    messages: [new HumanMessage('quiero una camiseta?')],
  })
  console.log(response.response)
}

// main()
