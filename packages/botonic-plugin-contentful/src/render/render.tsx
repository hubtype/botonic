import { Text, Button, Pic, Carousel } from '@botonic/react';
import * as React from 'react';
import { Carousel as CmsCarousel, Element } from '../cms';

export class Renderer {
  element(msg: Element): React.ReactNode {
    let nodes: JSX.Element[] = [];
    if (msg.imgUrl) {
      nodes = nodes.concat(<Pic src={msg.imgUrl} />);
    }

    nodes = nodes.concat(
      <Text>
        {msg.title || ''}
        <p />
        {msg.subtitle || ''}
        <>
          {msg.buttons.map(button =>
            button.callback.payload ? (
              <Button payload={button.callback.payload}>{button.text}</Button>
            ) : (
              <Button url={button.callback.url}>{button.text}</Button>
            )
          )}
        </>
      </Text>
    );
    return <>{nodes}</>;
  }

  carousel(carousel: CmsCarousel): React.ReactNode {
    return (
      <>
        <Carousel>
          {carousel.elements.map(element => this.element(element))}
        </Carousel>
      </>
    );
  }
}
