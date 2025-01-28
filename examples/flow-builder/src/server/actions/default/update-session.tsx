import {
  FlowBuilderActionProps,
  FlowText,
  type PayloadParamsBase,
} from '@botonic/plugin-flow-builder'

import { REMOVE_SESSION_PAYLOAD_REGEX } from '../../constants'
import { UserData } from '../../domain/user-data'
import { BotRequest } from '../../types'
import { getPayloadData, getRequestData } from '../../utils/actions'
import { isWhatsApp } from '../../utils/env-utils'
import { ExtendedFlowBuilderAction } from './extended-flow-builder'

type SimpleType = string | number | boolean | undefined

//Action intended to be used to update session variables values (normally used in Flow Builder)
export class UpdateSessionAction extends ExtendedFlowBuilderAction {
  static async botonicInit(
    request: BotRequest
  ): Promise<FlowBuilderActionProps> {
    const { payload } = getRequestData(request)
    const { followUpContentID, ...sessionUpdates } =
      getPayloadData<PayloadParamsBase>(payload)

    if (isRemoveSessionPayload(request)) {
      request.session.user.extra_data = {}
      UserData.get(request.session)
    } else {
      await updateSession(request, sessionUpdates)
    }

    return followUpContentID
      ? super.botonicInit(request, { contentId: followUpContentID })
      : { contents: [] }
  }
}

function isRemoveSessionPayload(request: BotRequest): boolean {
  const { payload } = getRequestData(request)
  return REMOVE_SESSION_PAYLOAD_REGEX.test(payload)
}

async function updateSession(
  request: BotRequest,
  sessionUpdates: Record<string, SimpleType>
): Promise<void> {
  const sessionVariables = Object.entries(sessionUpdates)

  for (const [key, value] of sessionVariables) {
    const session = request.session as any
    if (session[key]) {
      session[key] = await getValue(request, value)
    } else {
      request.session.user.extra_data[key] = await getValue(request, value)
    }
  }
}

async function getValue(
  request: BotRequest,
  value: SimpleType
): Promise<SimpleType> {
  const keywords = await getKeywords(request)
  const keywordFound = Object.keys(keywords).find(keyword => keyword === value)
  return keywordFound ? keywords[keywordFound] : value
}

async function getKeywords(request: BotRequest): Promise<Record<string, any>> {
  const { cmsPlugin, userInput, referral, payload, botContext } =
    getRequestData(request)

  const { followUpContentID } = getPayloadData<PayloadParamsBase>(payload)

  let followUpText: string | undefined = undefined

  if (followUpContentID) {
    const followUpContent = (
      await cmsPlugin.getContentsByContentID(
        followUpContentID,
        botContext.locale
      )
    )[0]

    if (followUpContent instanceof FlowText) {
      followUpText = followUpContent.text
    }
  }

  return {
    undefined: undefined,
    userInput,
    buttonClicked: isWhatsApp(request.session) ? referral : userInput,
    newDate: new Date(),
    followUpContentID,
    followUpText,
  }
}
