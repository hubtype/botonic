import { Button, Carousel, Element, Pic, Subtitle, Title } from '@botonic/react'
import React from 'react'

import { CarouselNode } from '../flow-builder-models'
import { ContentFieldsBase } from './content-fields-base'
import { FlowElement } from './flow-element'

export class FlowCarousel extends ContentFieldsBase {
  public code = ''
  public elements: FlowElement[] = []

  static fromHubtypeCMS(component: CarouselNode, locale: string): FlowCarousel {
    const newCarousel = new FlowCarousel(component.id)
    newCarousel.code = component.code
    newCarousel.elements = component.content.elements.map(element =>
      FlowElement.fromHubtypeCMS(element, locale)
    )
    return newCarousel
  }

  toBotonic(id: string): JSX.Element {
    return (
      <Carousel key={id}>
        {this.elements.map(element => (
          <Element key={`${id}-${element.id}`}>
            <Pic src={element.image} />
            <Title style=''>{element.title}</Title>
            <Subtitle style=''>{element.subtitle}</Subtitle>
            {/* @ts-ignore */}
            <Button
              payload={element.buttons?.payload}
              url={element.buttons?.url}
            >
              {element.buttons?.text}
            </Button>
          </Element>
        ))}
      </Carousel>
    )
  }
}
