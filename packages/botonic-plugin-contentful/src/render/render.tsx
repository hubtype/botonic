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
  element(msg: cms.Element): React.ReactNode {
    let nodes: JSX.Element[] = [];
    if (msg.imgUrl) {
      nodes = nodes.concat(<Pic src={msg.imgUrl} />);
    }

    nodes = nodes.concat(
      <Title>{msg.title || ''}</Title>,
      <Subtitle>{msg.subtitle || ''}</Subtitle>,
      <>{msg.buttons.map(b => this.button(b))}</>
    );
    return <Element>{nodes}</Element>;
  }

  carousel(carousel: cms.Carousel): React.ReactNode {
    return (
      <>
        <Carousel>
          {carousel.elements.map(element => this.element(element))}
        </Carousel>
      </>
    );
  }

  text(text: cms.Text, delayS: number = 0): React.ReactNode {
    let node = (
      <Text delay={delayS}>
        {text.text}
        {text.buttons.map(b => this.button(b))}
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

  private button(button: cms.Button): React.ReactNode {
    return button.callback.payload ? (
      <Button payload={button.callback.payload}>{button.text}</Button>
    ) : (
      <Button url={button.callback.url}>{button.text}</Button>
    );
  }
}
