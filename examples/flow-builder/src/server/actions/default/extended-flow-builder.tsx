import {
  FlowBuilderActionProps,
  FlowBuilderMultichannelAction,
} from '@botonic/plugin-flow-builder'
import { RequestContext, WebchatSettings } from '@botonic/react'
import React from 'react'

import { BotRequest } from '../../types'
import { renderFlowBuilderContents } from '../../utils/flow-builder'

interface Data {
  contentId?: string
  webchatSettingsParams?: any
}

export interface ExtendedFlowBuilderActionProps extends FlowBuilderActionProps {
  webchatSettingsParams?: Record<string, any>
}

export class ExtendedFlowBuilderAction extends React.Component<ExtendedFlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(
    request: BotRequest,
    data?: Data
  ): Promise<ExtendedFlowBuilderActionProps> {
    const contents = (
      await FlowBuilderMultichannelAction.botonicInit(request, data?.contentId)
    ).contents

    return { contents, webchatSettingsParams: data?.webchatSettingsParams }
  }

  render(): React.ReactNode {
    const { contents, webchatSettingsParams } = this.props
    return (
      <>
        {renderFlowBuilderContents(contents, this.context as BotRequest)}
        {webchatSettingsParams && (
          <WebchatSettings {...webchatSettingsParams} />
        )}
      </>
    )
  }
}
