import { Button, Carousel, Element, Pic, Subtitle, Title } from '@botonic/react'
import React from 'react'

import { HtCarouselNode } from '../hubtype-models'
import { ContentFieldsBase } from './content-base'
import { FlowElement } from './element'

export class FlowCarousel extends ContentFieldsBase {
  public code = ''
  public elements: FlowElement[] = []

  static fromHubtypeCMS(
    component: HtCarouselNode,
    locale: string
  ): FlowCarousel {
    const newCarousel = new FlowCarousel(component.id)
    newCarousel.code = component.code
    newCarousel.elements = component.content.elements.map(ele =>
      FlowElement.fromHubtypeCMS(ele, locale)
    )
    return newCarousel
  }

  toBotonic(index: number) {
    return (
      <Carousel key={index}>
        {this.elements.map((e, eIndex) => (
          <Element key={eIndex}>
            <Pic src={e.image} />
            <Title style=''>{e.title}</Title>
            <Subtitle style=''>{e.subtitle}</Subtitle>
            {/* @ts-ignore */}
            <Button payload={e.buttons?.payload}>{e.buttons?.text}</Button>
          </Element>
        ))}
      </Carousel>
    )
  }
}
