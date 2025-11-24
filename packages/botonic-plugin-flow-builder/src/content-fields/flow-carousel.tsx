import { ActionRequest, Carousel } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { FlowElement } from './flow-element'
import { HtCarouselNode } from './hubtype-fields'

export class FlowCarousel extends ContentFieldsBase {
  public elements: FlowElement[] = []

  static fromHubtypeCMS(
    component: HtCarouselNode,
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowCarousel {
    const newCarousel = new FlowCarousel(component.id)
    newCarousel.code = component.code
    newCarousel.elements = component.content.elements.map(element =>
      FlowElement.fromHubtypeCMS(element, locale, cmsApi)
    )
    newCarousel.followUp = component.follow_up

    return newCarousel
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
    for (const element of this.elements) {
      await element.trackFlow(request)
    }
  }

  toBotonic(id: string): JSX.Element {
    return (
      <Carousel key={id}>
        {this.elements.map(element => element.toBotonic(id))}
      </Carousel>
    )
  }
}
