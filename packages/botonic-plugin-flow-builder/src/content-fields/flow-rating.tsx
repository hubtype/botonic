import { isDev, isWebchat, isWhatsapp } from '@botonic/core'
import {
  type ActionRequest,
  CustomRatingMessage,
  Text,
  WhatsappButtonList,
} from '@botonic/react'

import { getFlowBuilderPlugin } from '../helpers'
import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'
import { type HtRatingNode, RatingType } from './hubtype-fields'

export class FlowRating extends ContentFieldsBase {
  public text = ''
  public sendButtonText = ''
  public ratingType = RatingType.Stars
  public buttons: FlowButton[] = []
  public openListButtonText = ''

  static fromHubtypeCMS(cmsText: HtRatingNode, locale: string): FlowRating {
    const newRating = new FlowRating(cmsText.id)
    newRating.code = cmsText.code
    newRating.text = FlowRating.getTextByLocale(locale, cmsText.content.text)
    newRating.sendButtonText = FlowRating.getTextByLocale(
      locale,
      cmsText.content.send_button_text
    )
    newRating.ratingType = cmsText.content.rating_type
    newRating.buttons = cmsText.content.buttons.map(button =>
      FlowButton.fromRating(button)
    )
    newRating.openListButtonText = FlowRating.getTextByLocale(
      locale,
      cmsText.content.open_list_button_text
    )
    newRating.followUp = cmsText.follow_up

    return newRating
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
    const customRatingMessageEnabled =
      flowBuilderPlugin.customRatingMessageEnabled
    const replacedText = this.replaceVariables(this.text, request)

    if (isWhatsapp(request.session)) {
      return (
        <WhatsappButtonList
          body={replacedText}
          button={this.openListButtonText}
          sections={[
            {
              rows: this.buttons.map(button => ({
                id: button.payload as string,
                title: button.text,
              })),
            },
          ]}
        />
      )
    }

    if (
      (isWebchat(request.session) || isDev(request.session)) &&
      customRatingMessageEnabled
    ) {
      const payloads = this.buttons
        .map(button => button.payload)
        .slice()
        .reverse()

      return (
        <CustomRatingMessage
          alt={replacedText}
          payloads={payloads}
          messageText={replacedText}
          buttonText={this.sendButtonText}
          ratingType={this.ratingType}
        />
      )
    }

    return (
      <Text key={id}>
        {replacedText}
        {this.buttons.map((button, buttonIndex) =>
          button.renderButton(buttonIndex)
        )}
      </Text>
    )
  }
}
