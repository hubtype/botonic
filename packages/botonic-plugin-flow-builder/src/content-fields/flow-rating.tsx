import { type BotContext, isDev, isWebchat, isWhatsapp } from '@botonic/core'
import { CustomRatingMessage, Text, WhatsappButtonList } from '@botonic/react'

import { trackOneContent } from '../tracking'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'
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

  async trackFlow(botContext: BotContext): Promise<void> {
    await trackOneContent(botContext, this)
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.trackFlow(botContext)
    return
  }

  toBotonic(botContext: BotContext): JSX.Element {
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    const customRatingMessageEnabled =
      flowBuilderPlugin.customRatingMessageEnabled
    const replacedText = this.replaceVariables(this.text, botContext)

    if (isWhatsapp(botContext.session)) {
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
      (isWebchat(botContext.session) || isDev(botContext.session)) &&
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
      <Text key={this.id}>
        {replacedText}
        {this.buttons.map((button, buttonIndex) =>
          button.renderButton(buttonIndex)
        )}
      </Text>
    )
  }
}
