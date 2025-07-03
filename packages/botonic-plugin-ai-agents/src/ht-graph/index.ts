// import { StateGraph, START, END } from '@langchain/langgraph'
// import { callModel, respond } from './nodes'
// import { shouldContinue } from './edges'
// import { ToolNode } from '@langchain/langgraph/prebuilt'
// import { TOOLS } from './tools'
// import { AgenticState } from './state'
// import { HumanMessage, SystemMessage } from '@langchain/core/messages'

// const workflow = new StateGraph(AgenticState)
//   .addNode('agent', callModel)
//   .addNode('tools', new ToolNode(TOOLS))
//   .addNode('respond', respond)
//   .addEdge(START, 'agent')
//   .addConditionalEdges('agent', shouldContinue, ['respond', 'tools'])
//   .addEdge('tools', 'agent')
//   .addEdge('respond', END)

// const graph = workflow.compile()

// async function main() {
//   const result = await graph.invoke({
//     messages: [
//       new SystemMessage(
//         'You are a fashion assistant. Before recommending, always ask for extra preferences in order to perform a better recommendation (genre, colors, size, etc.). Ask these preferences one by one by providing a list of buttons. Use rich messages whenever possible to improve the user experience.'
//       ),
//       new HumanMessage('quiero una camiseta?'),
//     ],
//   })
//   console.log(result.response)
// }

// main()
