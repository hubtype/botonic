import * as React from 'react';
import {
  Text,
  Button,
  Pic,
  Carousel,
  Element,
  Title,
  Subtitle
} from '@botonic/react';
import * as cms from '../src';

test('TEST: render element', () => {
  let sut = new cms.Renderer();
  let msg = new cms.Element(
    [
      new cms.Button('my button1', cms.Callback.ofPayload('my payload1')),
      new cms.Button('my button2', cms.Callback.ofUrl('http://url2'))
    ],
    'my title',
    'my subtitle',
    'http://myimg.jpg'
  );

  // act
  let render = sut.element(msg, 0);

  // assert
  expect(render).toEqual(
    <Element key="0">
      <Pic src="http://myimg.jpg" />
      <Title>my title</Title>
      <Subtitle>my subtitle</Subtitle>
      <>
        <Button key="0" payload="my payload1">
          my button1
        </Button>
        <Button key="1" url="http://url2">
          my button2
        </Button>
      </>
    </Element>
  );
});

test('TEST: render_Carousel', () => {
  let sut = new cms.Renderer();

  let msg = new cms.Element(
    [
      new cms.Button('my button1', cms.Callback.ofPayload('my payload1')),
      new cms.Button('my button2', cms.Callback.ofUrl('http://url2'))
    ],
    'my title',
    'my subtitle',
    'http://myimg.jpg'
  );

  let msg2 = Object.create(msg);
  msg2.title = 'my title2';

  let carousel = new cms.Carousel([msg, msg2]);

  // act
  let render = sut.carousel(carousel);

  // assert
  let expected = (
    <>
      <Carousel>
        <Element key="0">
          <Pic src="http://myimg.jpg" />
          <Title>my title</Title>
          <Subtitle>my subtitle</Subtitle>
          <>
            <Button key="0" payload="my payload1">
              my button1
            </Button>
            <Button key="1" url="http://url2">
              my button2
            </Button>
          </>
        </Element>
        <Element key="1">
          <Pic src="http://myimg.jpg" />
          <Title>my title2</Title>
          <Subtitle>my subtitle</Subtitle>
          <>
            <Button key="0" payload="my payload1">
              my button1
            </Button>
            <Button key="1" url="http://url2">
              my button2
            </Button>
          </>
        </Element>
      </Carousel>
    </>
  );
  expect(render).toEqual(expected);
});

test('TEST: render text without buttons nor followup', () => {
  let sut = new cms.Renderer();
  let text = new cms.Text('my text', []);

  // act
  let render = sut.text(text);

  // assert
  expect(render).toEqual(
    <Text delay={0}>
      my text
      {[]}
    </Text>
  );
});

test('TEST: render text with buttons and followup', () => {
  let sut = new cms.Renderer();
  let followUp = new cms.Text('my text FU', [
    new cms.Button('my button FU', cms.Callback.ofPayload('my payload FU'))
  ]);
  let text = new cms.Text(
    'my text',
    [
      new cms.Button('my button1', cms.Callback.ofPayload('my payload1')),
      new cms.Button('my button2', cms.Callback.ofUrl('http://url2'))
    ],
    followUp
  );

  // act
  let render = sut.text(text);
  let button1 = (
    <Button key="0" payload="my payload1">
      my button1
    </Button>
  );
  let button2 = (
    <Button key="1" url="http://url2">
      my button2
    </Button>
  );
  // assert
  expect(render).toEqual(
    <>
      <Text delay={0}>
        my text
        {[button1, button2]}
      </Text>
      <Text delay={3}>
        my text FU
        {[
          <Button key="0" payload="my payload FU">
            my button FU
          </Button>
        ]}
      </Text>
    </>
  );
});
