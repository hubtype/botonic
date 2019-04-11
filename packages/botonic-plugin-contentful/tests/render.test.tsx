import { Renderer } from "../src/render/render";
import * as model from "../src/cms/model";
import * as React from "react";
import * as botoreact from "@botonic/react";
import { Callback } from "../src/cms/cms";

test("TEST: render RichMessage", () => {
  let sut = new Renderer();
  let msg = new model.RichMessage("my title", "my subtitle", "http://myimg.jpg");
  msg.addButton(new model.Button('my button1', Callback.ofPayload("my payload1")));
  msg.addButton(new model.Button('my button2', Callback.ofUrl("http://url2")));

  // act
  let render = sut.richMessage(msg);

  // assert
  expect(render).toEqual(<>
    <botoreact.Image src="http://myimg.jpg" />
    <botoreact.Text>
      my title<p />
      my subtitle
      <>
        <botoreact.Button payload="my payload1">my button1</botoreact.Button>
        <botoreact.Button url="http://url2">my button2</botoreact.Button>
      </>
    </botoreact.Text>
  </>
  );
});

test("TEST: render_Carousel", () => {
  let sut = new Renderer();

  let msg = new model.RichMessage("my title", "my subtitle", "http://myimg.jpg");
  msg.addButton(new model.Button('my button1', Callback.ofPayload("my payload1")));
  msg.addButton(new model.Button('my button2', Callback.ofUrl("http://url2")));

  let msg2 = Object.create(msg);
  msg2.title = "my title2";

  let carousel = new model.Carousel()
    .addElement(msg)
    .addElement(msg2);

  // act
  let render = sut.carousel(carousel);

  // asert
  let expected = <>
    <>
      <botoreact.Image src="http://myimg.jpg" />
      <botoreact.Text>
        my title<p />
        my subtitle
          <>
          <botoreact.Button payload="my payload1">my button1</botoreact.Button>
          <botoreact.Button url="http://url2">my button2</botoreact.Button>
        </>
      </botoreact.Text>
    </>
    <>
      <botoreact.Image src="http://myimg.jpg" />
      <botoreact.Text>
        my title2<p />
        my subtitle
          <>
          <botoreact.Button payload="my payload1">my button1</botoreact.Button>
          <botoreact.Button url="http://url2">my button2</botoreact.Button>
        </>
      </botoreact.Text>
    </>
  </>;
  expect(render).toEqual(expected);
});
