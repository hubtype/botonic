import { CarouselElementNode } from '../flow-builder-models'
import { ContentFieldsBase } from './content-fields-base'
import { FlowButton } from './flow-button'

export class FlowElement extends ContentFieldsBase {
  public title = ''
  public subtitle = ''
  public buttons: FlowButton | undefined
  public image = ''
  public hidden = false

  static fromHubtypeCMS(
    component: CarouselElementNode,
    locale: string
  ): FlowElement {
    const newElement = new FlowElement(component.id)
    newElement.title = FlowElement.getTextByLocale(locale, component.title)
    newElement.subtitle = FlowElement.getTextByLocale(
      locale,
      component.subtitle
    )
    newElement.image = FlowElement.getImageByLocale(locale, component.image)
    newElement.buttons = FlowButton.fromHubtypeCMS(component.button, locale)
    return newElement
  }
}
