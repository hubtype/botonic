import {
  Text,
  Button,
  Pic,
  Carousel,
  Title,
  Subtitle,
  Element
} from '@botonic/react';
import * as React from 'react';
import * as cms from '../cms';

export class Renderer {
  element(msg: cms.Element, index: number): React.ReactNode {
    return (
      <Element key={index}>
        {msg.imgUrl && <Pic src={msg.imgUrl} />}
        <Title>{msg.title || ''}</Title>
        <Subtitle>{msg.subtitle || ''}</Subtitle>
        <>{msg.buttons.map((b, i) => this.button(b, i))}</>
      </Element>
    );
  }

  carousel(carousel: cms.Carousel): React.ReactNode {
    return (
      <>
        <Carousel>
          {carousel.elements.map((element, i) => this.element(element, i))}
        </Carousel>
      </>
    );
  }

  text(text: cms.Text, delayS: number = 0): React.ReactNode {
    let node = (
      <Text delay={delayS}>
        {text.text}
        {text.buttons.map((b, i) => this.button(b, i))}
      </Text>
    );
    if (text.followup) {
      return (
        <>
          {node}
          {this.followUp(text.followup)}
        </>
      );
    }
    return node;
  }

  private followUp(followUp: cms.Text | cms.Carousel): React.ReactNode {
    if (followUp instanceof cms.Text) {
      // give use time to read the initial text
      return this.text(followUp, 3);
    }
    // for carousels, the initial text usually introduces the carousel
    return this.carousel(followUp);
  }

  private button(button: cms.Button, index: number): React.ReactNode {
    let cb = button.callback;
    return cb.payload ? (
      <Button key={index} payload={cb.payload}>
        {button.text}
      </Button>
    ) : (
      <Button key={index} url={cb.url}>
        {button.text}
      </Button>
    );
  }
}
