import * as React from 'react';
import * as botoreact from '@botonic/react';
import * as cms from '../src';

test('TEST: render element', () => {
  let sut = new cms.Renderer();
  let msg = new cms.Element('my title', 'my subtitle', 'http://myimg.jpg');
  msg.addButton(
    new cms.Button('my button1', cms.Callback.ofPayload('my payload1'))
  );
  msg.addButton(
    new cms.Button('my button2', cms.Callback.ofUrl('http://url2'))
  );

  // act
  let render = sut.element(msg);

  // assert
  expect(render).toEqual(
    <>
      <botoreact.Image src="http://myimg.jpg" />
      <botoreact.Text>
        my title
        <p />
        my subtitle
        <>
          <botoreact.Button payload="my payload1">my button1</botoreact.Button>
          <botoreact.Button url="http://url2">my button2</botoreact.Button>
        </>
      </botoreact.Text>
    </>
  );
});

test('TEST: render_Carousel', () => {
  let sut = new cms.Renderer();

  let msg = new cms.Element('my title', 'my subtitle', 'http://myimg.jpg');
  msg.addButton(
    new cms.Button('my button1', cms.Callback.ofPayload('my payload1'))
  );
  msg.addButton(
    new cms.Button('my button2', cms.Callback.ofUrl('http://url2'))
  );

  let msg2 = Object.create(msg);
  msg2.title = 'my title2';

  let carousel = new cms.Carousel([msg, msg2]);

  // act
  let render = sut.carousel(carousel);

  // assert
  let expected = (
    <>
      <>
        <botoreact.Image src="http://myimg.jpg" />
        <botoreact.Text>
          my title
          <p />
          my subtitle
          <>
            <botoreact.Button payload="my payload1">
              my button1
            </botoreact.Button>
            <botoreact.Button url="http://url2">my button2</botoreact.Button>
          </>
        </botoreact.Text>
      </>
      <>
        <botoreact.Image src="http://myimg.jpg" />
        <botoreact.Text>
          my title2
          <p />
          my subtitle
          <>
            <botoreact.Button payload="my payload1">
              my button1
            </botoreact.Button>
            <botoreact.Button url="http://url2">my button2</botoreact.Button>
          </>
        </botoreact.Text>
      </>
    </>
  );
  expect(render).toEqual(expected);
});
