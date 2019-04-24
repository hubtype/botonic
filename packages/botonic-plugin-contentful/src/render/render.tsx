import { Text, Button, Pic, Carousel } from '@botonic/react';
import * as React from 'react';
import * as cms from '../cms';

export class Renderer {
  element(msg: cms.Element): React.ReactNode {
    let nodes: JSX.Element[] = [];
    if (msg.imgUrl) {
      nodes = nodes.concat(<Pic src={msg.imgUrl} />);
    }

    nodes = nodes.concat(
      <Text>
        {msg.title || ''}
        <p />
        {msg.subtitle || ''}
        <>{msg.buttons.map(b => this.button(b))}</>
      </Text>
    );
    return <>{nodes}</>;
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

  private button(button: cms.Button): React.ReactNode {
    return button.callback.payload ? (
      <Button payload={button.callback.payload}>{button.text}</Button>
    ) : (
      <Button url={button.callback.url}>{button.text}</Button>
    );
  }
}
