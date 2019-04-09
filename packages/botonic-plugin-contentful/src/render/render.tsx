import { RequestContext, Text, Button, Reply, Image } from "@botonic/react";
import { ReactNode } from "react";
import { RichMessage, Carousel } from "../cms/model";

export class Renderer {
  richMessage(msg: RichMessage): ReactNode {
    return (
      <>
        <Image src={msg.imgURL} />
        <Text>
          {msg.title}
          {msg.subtitle}
          <Button payload={msg.button.payload}>{msg.button.text}</Button>
        </Text>
      </>
    );
  }

  carousel(carousel: Carousel) {}
}
