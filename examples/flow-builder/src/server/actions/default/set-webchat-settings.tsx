import { type PayloadParamsBase } from '@botonic/plugin-flow-builder'

import { BotRequest } from '../../types'
import { getPayloadData, getRequestData } from '../../utils/actions'
import {
  ExtendedFlowBuilderAction,
  ExtendedFlowBuilderActionProps,
} from './extended-flow-builder'

interface PayloadParams extends PayloadParamsBase {
  webchatSettings?: Record<string, any>
}

//Action intended to be used to set webchat settings (normally used in Flow Builder)
export class SetWebchatSettings extends ExtendedFlowBuilderAction {
  static async botonicInit(
    request: BotRequest
  ): Promise<ExtendedFlowBuilderActionProps> {
    const { payload } = getRequestData(request)
    const { followUpContentID, ...webchatSettings } =
      getPayloadData<PayloadParams>(payload)

    return followUpContentID
      ? super.botonicInit(request, {
          contentId: followUpContentID,
          webchatSettingsParams: webchatSettings,
        })
      : { contents: [], webchatSettingsParams: webchatSettings }
  }
}
