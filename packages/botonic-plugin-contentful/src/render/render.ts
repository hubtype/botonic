// import {
//   Button,
//   Carousel,
//   Element,
//   Image,
//   Pic,
//   Reply,
//   Subtitle,
//   Text,
//   Title
// } from '@botonic/react';
// import * as React from 'react';
// import * as cms from '../cms';
// import { ButtonStyle } from '../cms';
//
export class RenderOptions {
  followUpDelaySeconds = 4;
  maxButtons = 3;
  maxQuickReplies = 5;
}
//
export class Renderer {
  constructor(readonly options = new RenderOptions()) {}
//
//   element(msg: cms.Element, index: number): React.ReactNode {
//     return (
//       <Element key={index}>
//         {msg.imgUrl ? <Pic src={msg.imgUrl} /> : null}
//         {msg.title ? <Title>{msg.title}</Title> : null}
//         {msg.subtitle ? <Subtitle>{msg.subtitle}</Subtitle> : null}
//         {this.buttons(msg.buttons, ButtonStyle.BUTTON)}
//       </Element>
//     );
//   }
//
//   carousel(carousel: cms.Carousel, delayS: number = 0): React.ReactNode {
//     return (
//       <>
//         <Carousel delay={delayS}>
//           {carousel.elements.map((element, i) => this.element(element, i))}
//         </Carousel>
//       </>
//     );
//   }
//
//   text(text: cms.Text, delayS: number = 0): React.ReactNode {
//     let node = (
//       <Text delay={delayS}>
//         {text.text}
//         {this.buttons(text.buttons, text.buttonsStyle)}
//       </Text>
//     );
//     if (text.followUp) {
//       return (
//         <>
//           {node}
//           {this.followUp(text.followUp)}
//         </>
//       );
//     }
//     return node;
//   }
//
//   image(img: cms.Image): React.ReactNode {
//     return <Image src={img.imgUrl} />;
//   }
//
//   private followUp(followUp: cms.FollowUp): React.ReactNode {
//     if (followUp instanceof cms.Text) {
//       // give user time to read the initial text
//       return this.text(followUp, this.options.followUpDelaySeconds);
//     } else if (followUp instanceof cms.Carousel) {
//       // for carousels, the previous text usually introduces the carousel. So, we set a smaller delay
//       return this.carousel(followUp, 2);
//     } else if (followUp instanceof cms.Image) {
//       return this.image(followUp);
//     } else {
//       throw new Error('Unexpected followUp type ' + typeof followUp);
//     }
//   }
//
//   private buttons(buttons: cms.Button[], style: ButtonStyle): React.ReactNode {
//     let maxButtons =
//       style == ButtonStyle.BUTTON
//         ? this.options.maxButtons
//         : this.options.maxQuickReplies;
//     return (
//       <>
//         {buttons.slice(0, maxButtons).map((button, index) => {
//           let props = {
//             key: index,
//             payload: button.callback.payload,
//             url: button.callback.url
//           };
//           if (style == ButtonStyle.QUICK_REPLY) {
//             return <Reply {...props}>{button.text}</Reply>;
//           } else {
//             return <Button {...props}>{button.text}</Button>;
//           }
//         })}
//       </>
//     );
//   }
}
