import { CoreBot } from '@botonic/core'
import type React from 'react'

import { Text } from './components/text'
import { RequestContext } from './contexts'
import type { ActionRequest } from './index-types'

type ActionComponentType<P = any> = React.ComponentType<P> & {
  botonicInit?: (request: ActionRequest) => Promise<P>
  contextType?: React.Context<typeof RequestContext>
  render: (props: P) => JSX.Element
}
interface RenderReactActionsArgs {
  request: ActionRequest
  actions: ActionComponentType[]
}

export class ReactBot extends CoreBot {
  constructor(options: any) {
    super({
      defaultRoutes: [
        {
          path: '404',
          action: () => <Text>I don't understand you</Text>, // eslint-disable-line
        },
      ],
      renderer: (args: RenderReactActionsArgs) => this.renderReactActions(args),
      ...options,
    })
  }

  async renderReactActions({ request, actions }: RenderReactActionsArgs) {
    const renderedActions: JSX.Element[] = []

    for (const Action of actions) {
      if (Action) {
        const props = Action.botonicInit
          ? await Action.botonicInit(request)
          : {}
        const renderedAction: JSX.Element = (
          <RequestContext.Provider value={request}>
            <Action {...props} />
          </RequestContext.Provider>
        )
        renderedActions.push(renderedAction)
      }
    }

    return renderedActions
  }
}
