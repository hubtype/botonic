import {
  Button,
  Carousel,
  Element,
  Image,
  Pic,
  Subtitle,
  Text,
  Title,
  msgsToBotonic,
  Reply
} from '@botonic/react';
import * as React from 'react';
import { ButtonStyle } from '../../src';
import * as cms from '../../src';
import { TextBuilder } from '../../src/cms/factories';
import { BotonicMsgConverter } from '../../src/render/botonic-converter';

test('TEST: convert element with 2 buttons', () => {
  let sut = new BotonicMsgConverter();
  let element = new cms.Element(
    [
      new cms.Button('but1', 'but text1', cms.Callback.ofPayload('payload1')),
      new cms.Button('but2', 'but text2', cms.Callback.ofUrl('http://url2'))
    ],
    'my title',
    'my subtitle',
    'http://myimg.jpg'
  );

  // act
  let msgs = sut.carousel(new cms.Carousel('name', [element]));
  let render = msgsToBotonic(msgs);

  // assert
  expect(render).toEqual(
    <Element key="0">
      <Pic src="http://myimg.jpg" />
      <Title>my title</Title>
      <Subtitle>my subtitle</Subtitle>
      <>
        <Button key="0" payload="payload1">
          but text1
        </Button>
        <Button key="1" url="http://url2">
          but text2
        </Button>
      </>
    </Element>
  );
});

test('TEST: convert element without image', () => {
  let sut = new BotonicMsgConverter();
  let element = new cms.Element(
    [new cms.Button('but1', 'but text1', cms.Callback.ofPayload('payload1'))],
    'my title',
    'my subtitle',
    undefined
  );

  // act
  let msgs = sut.carousel(new cms.Carousel('name', [element]));
  let render = msgsToBotonic(msgs);

  // assert
  expect(render).toEqual(
    <Carousel>
      <Element key="0">
        {null}
        <Title>my title</Title>
        <Subtitle>my subtitle</Subtitle>
        <>
          {[
            <Button key="0" payload="payload1">
              but text1
            </Button>
          ]}
        </>
      </Element>
    </Carousel>
  );
});

test('TEST: convert_Carousel', () => {
  let sut = new BotonicMsgConverter();

  let element = new cms.Element(
    [new cms.Button('but1', 'but text1', cms.Callback.ofPayload('payload1'))],
    'my title',
    'my subtitle',
    'http://myimg.jpg'
  );

  let msg2 = Object.create(element);
  msg2.title = 'my title2';

  let carousel = new cms.Carousel('name', [element, msg2]);

  // act
  let msgs = sut.carousel(carousel);
  let render = msgsToBotonic(msgs);

  // assert
  let expected = (
    <>
      <Carousel delay={0}>
        <Element key="0">
          <Pic src="http://myimg.jpg" />
          <Title>my title</Title>
          <Subtitle>my subtitle</Subtitle>
          <>
            {[
              <Button key="0" payload="payload1">
                but text1
              </Button>
            ]}
          </>
        </Element>
        <Element key="1">
          <Pic src="http://myimg.jpg" />
          <Title>my title2</Title>
          <Subtitle>my subtitle</Subtitle>
          <>
            {[
              <Button key="0" payload="payload1">
                but text1
              </Button>
            ]}
          </>
        </Element>
      </Carousel>
    </>
  );
  expect(render).toEqual(expected);
});

test('TEST: BotsonRenderer text without buttons nor followup', () => {
  let sut = new BotonicMsgConverter();
  let text = new cms.Text('name', 'my text', []);

  // act
  let msgs = sut.text(text);
  let render = msgsToBotonic(msgs);

  // assert
  expect(render).toEqual(
    <Text delay={0}>
      my text
      <>{[]}</>
    </Text>
  );
});

test('TEST: convert text with buttons and followup with reply buttons', () => {
  let sut = new BotonicMsgConverter();
  let followUp = new TextBuilder('textFollowUp', 'my text FU')
    .withButtons([
      new cms.Button(
        'butFU',
        'but FU txt',
        cms.Callback.ofPayload('payload FU')
      )
    ])
    .withButtonStyle(ButtonStyle.QUICK_REPLY)
    .build();
  let text = new TextBuilder('textMain', 'my text')
    .withButtons([
      new cms.Button('but1', 'but text1', cms.Callback.ofPayload('payload1'))
    ])
    .withShortText('short text')
    .withFollowUp(followUp)
    .build();

  // act
  let msgs = sut.text(text);
  let render = msgsToBotonic(msgs);

  // assert
  expect(render).toEqual(
    <>
      <Text delay={0}>
        my text
        <>
          {[
            <Button key="0" payload="payload1">
              but text1
            </Button>
          ]}
        </>
      </Text>
      <Text delay={4}>
        my text FU
        <>
          {[
            <Reply key="0" payload="payload FU">
              but FU txt
            </Reply>
          ]}
        </>
      </Text>
    </>
  );
});

test('TEST: convert image', () => {
  let image = new cms.Image('name', 'http://domain.net/img.jpg');
  let msg = new BotonicMsgConverter().image(image);
  let render = msgsToBotonic(msg);
  expect(render).toEqual(<Image src="http://domain.net/img.jpg" />);
});
