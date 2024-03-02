# Botonic Examples

This repository contains a set of projects available implemented in
[Botonic](https://botonic.io).

Each example is standalone and can be initialized by running:

```bash
$ botonic new <botName>
```

and select it from the selector.

## Overview of Examples

<table>
  <tr>
    <th>Name</th>
    <th>Live Demo</th>
    <th>Description</th>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/blank">
        Blank
      </a>
    </td>
    <td align="center"></td>
    <td>
      Template with empty actions. The bot will always respond with the
      default `404` action "I don't understand you" when you test it.
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/blank-typescript">
        Blank Typescript
      </a>
    </td>
    <td align="center"></td>
    <td>
      Template with empty actions prepared to be used with Typescript.
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/booking-platform">
        Booking Platform
      </a>
    </td>
    <td align="center">
      <a href="https://botonic-example-booking-platform.netlify.app/">🔗</a>
    </td>
    <td>
      This example shows you how to make a reservation in a hotel using a
      cover component, custom messages and webviews.
    </td>
  </tr>
   <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/childs">
        Childs
      </a>
    </td>
    <td align="center"></td>
    <td>
      Simple example on how childRoutes work. It allows you to build a bot
      with deep flows and navigate a decision tree using interactive
      elements like buttons.
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/custom-webchat">
        Custom Webchat
      </a>
    </td>
    <td align="center"></td>
    <td>Customizable webchat that can be embedded in your website.</td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/dynamic-carousel">
        Dynamic Carousel
      </a>
    </td>
    <td align="center"></td>
    <td>
      Bot that gets data from an external API and renders a Carousel.
      Carousels are horizontal scrollable elements with image, title and
      buttons for users to trigger an action.
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/dynamodb">
        DynamoDB
      </a>
    </td>
    <td align="center"></td>
    <td>
      DynamoDB: Using AWS DynamoDB to track events.
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/handoff">
        Human Handoff
      </a>
    </td>
    <td align="center"></td>
    <td>Simple bot that transfers the conversation to Hubtype Desk.</td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/intent">
        Intent
      </a>
    </td>
    <td align="center"></td>
    <td>Bot that uses external AI like DialogFlow.</td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/telco-offers">
        Telco Offers
      </a>
    </td>
    <td align="center">
      <a href="botonic-example-telco-offers.netlify.app">🔗</a>
    </td>
    <td>
      This example shows you a multi-language conversation flow to acquire an Internet or a cell phone rate using buttons and replies.
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/hubtype/botonic-examples/tree/master/tutorial">
        Tutorial
      </a>
    </td>
    <td align="center"></td>
    <td>Example with comments to learn by reading the source files.</td>
  </tr> 
</table>

## Requirements

- Node.js version 20 or higher
- [NPM cli](https://docs.npmjs.com/cli/npm) or [Yarn](https://yarnpkg.com/en/)

## Contributing with new examples

1. Clone this project.
2. Create a new directory within `examples` directory:

   ```bash
   $ botonic new <exampleName>
   ```

3. Select an example from the prompted list to start with.
4. Let your imagination run wild.
5. Push your code.
6. Open a new [Pull Request](https://github.com/hubtype/botonic/pulls).
7. We will slightly evaluate and test the project and will be merged as soon as possible. 😊
