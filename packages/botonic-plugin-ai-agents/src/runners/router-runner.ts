import type { ResolvedPlugins } from '@botonic/core'

import { BaseRunner } from './base-runner'

export class RouterRunner<
  TPlugins extends ResolvedPlugins = ResolvedPlugins,
  TExtraData = unknown,
> extends BaseRunner<TPlugins, TExtraData> {}
