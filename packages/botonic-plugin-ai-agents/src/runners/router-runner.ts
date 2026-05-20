import type { ResolvedPlugins } from '@botonic/core'
import { type Handoff, RunHandoffOutputItem } from '@openai/agents'
import type { Agent } from '@openai/agents-core'

import type { Context, RunResult } from '../types'
import { BaseRunner, type RunnerResult } from './base-runner'

export class RouterRunner<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> extends BaseRunner<TPlugins, TExtraData> {
  protected override buildRunResult(
    result: RunnerResult,
    context: Context<TPlugins, TExtraData>,
    memoryLength: number
  ): RunResult {
    const base = super.buildRunResult(result, context, memoryLength)

    const availableHandoffs = (this.agent.handoffs ?? []).map(
      (entry: Agent<any, any> | Handoff<any, any>) => {
        const isHandoff =
          entry instanceof RunHandoffOutputItem === false && 'agent' in entry
        const agent = isHandoff
          ? (entry as Handoff<any, any>).agent
          : (entry as Agent<any, any>)
        const description = isHandoff
          ? (entry as Handoff<any, any>).toolDescription
          : agent.handoffDescription
        return { name: agent.name, description }
      }
    )

    return {
      ...base,
      startingAgentName: this.agent.name ?? '',
      lastAgentName: result.lastAgent?.name ?? '',
      availableHandoffs,
    }
  }
}
