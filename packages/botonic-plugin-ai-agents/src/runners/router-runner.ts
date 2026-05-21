import type { ResolvedPlugins } from '@botonic/core'
import { Handoff } from '@openai/agents'
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

    const availableSpecialists = (this.agent.handoffs ?? []).map(
      (entry: Agent<any, any> | Handoff<any, any>) => {
        const isHandoff = entry instanceof Handoff
        const agent = isHandoff ? entry.agent : (entry as Agent<any, any>)
        const description = isHandoff
          ? entry.toolDescription
          : agent.handoffDescription
        return { name: agent.name, description }
      }
    )

    const startingAgentName = this.agent.name ?? ''
    const lastAgentName = result.lastAgent?.name ?? ''

    return {
      ...base,
      startingAgentName,
      lastAgentName,
      availableSpecialists,
      isTransferredToSpecialist: startingAgentName !== lastAgentName,
    }
  }
}
