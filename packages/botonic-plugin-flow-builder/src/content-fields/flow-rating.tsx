import { isWhatsapp } from '@botonic/core'
import { ActionRequest, Text, WhatsappButtonList } from '@botonic/react'

import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'
import { HtRatingNode, RatingType } from './hubtype-fields'

export class FlowRating extends ContentFieldsBase {
  public code = ''
  public text = ''
  public sendButtonText = ''
  public ratingType = RatingType.Stars
  public buttons: FlowButton[] = []
  public openListButtonText = ''

  static fromHubtypeCMS(cmsText: HtRatingNode, locale: string): FlowRating {
    const newRating = new FlowRating(cmsText.id)
    newRating.code = cmsText.code
    newRating.text = this.getTextByLocale(locale, cmsText.content.text)
    newRating.sendButtonText = this.getTextByLocale(
      locale,
      cmsText.content.send_button_text
    )
    newRating.ratingType = cmsText.content.rating_type
    newRating.buttons = cmsText.content.buttons.map(button =>
      FlowButton.fromRating(button)
    )
    newRating.openListButtonText = this.getTextByLocale(
      locale,
      cmsText.content.open_list_button_text
    )

    return newRating
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    if (isWhatsapp(request.session)) {
      return (
        <WhatsappButtonList
          body={this.text}
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
    return (
      <Text key={id}>
        {this.text}
        {this.buttons.map((button, buttonIndex) =>
          button.renderButton(buttonIndex)
        )}
      </Text>
    )
  }
}
