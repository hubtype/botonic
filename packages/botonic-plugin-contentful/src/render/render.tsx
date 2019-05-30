import {
  Button,
  Carousel,
  Element,
  Pic,
  Reply,
  Subtitle,
  Text,
  Title
} from '@botonic/react';
import * as React from 'react';
import * as cms from '../cms';
import { ButtonStyle } from '../cms';

export class Renderer {
  constructor(readonly followUpDelaySeconds: number = 4) {}

  element(msg: cms.Element, index: number): React.ReactNode {
    return (
      <Element key={index}>
        <Pic src={msg.imgUrl || ''} />
        <Title>{msg.title || ''}</Title>
        <Subtitle>{msg.subtitle || ''}</Subtitle>
        {this.buttons(msg.buttons, ButtonStyle.BUTTON)}
      </Element>
    );
  }

  carousel(carousel: cms.Carousel, delayS: number = 0): React.ReactNode {
    return (
      <>
        <Carousel delay={delayS}>
          {carousel.elements.map((element, i) => this.element(element, i))}
        </Carousel>
      </>
    );
  }

  text(text: cms.Text, delayS: number = 0): React.ReactNode {
    let node = (
      <Text delay={delayS}>
        {text.text}
        {this.buttons(text.buttons, text.buttonsStyle)}
      </Text>
    );
    if (text.followUp) {
      return (
        <>
          {node}
          {this.followUp(text.followUp)}
        </>
      );
    }
    return node;
  }

  private followUp(followUp: cms.Text | cms.Carousel): React.ReactNode {
    if (followUp instanceof cms.Text) {
      // give user time to read the initial text
      return this.text(followUp, this.followUpDelaySeconds);
    }
    // for carousels, the previous text usually introduces the carousel. So, we set a smaller delay
    return this.carousel(followUp, 2);
  }

  private buttons(buttons: cms.Button[], style: ButtonStyle): React.ReactNode {
    return (
      <>
        {buttons.map((button, index) => {
          let props = {
            key: index,
            payload: button.callback.payload,
            url: button.callback.url
          };
          if (style == ButtonStyle.QUICK_REPLY) {
            return <Reply {...props}>{button.text}</Reply>;
          } else {
            return <Button {...props}>{button.text}</Button>;
          }
        })}
      </>
    );
  }
}
