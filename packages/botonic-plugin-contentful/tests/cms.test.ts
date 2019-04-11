import { CallbackMap, Callback } from "../src/cms/cms";
import { mock, instance } from "ts-mockito";

test("TEST: callbackMap multiple callbacks", () => {
  let callback1 = mock(Callback);
  let sut = new CallbackMap().addCallback('id1', callback1);
  expect(sut.getCallback('id1')).toBe(callback1);

  let callback2 = mock(Callback);
  sut.addCallback('id2', callback2);
  expect(sut.getCallback('id2')).toBe(callback2);
})

test("TEST: callbackMap fixed callback", () => {
  let callback = instance(mock(Callback));
  let sut = CallbackMap.forAllIds(callback);
  expect(sut.getCallback(Math.random().toString())).toBe(callback);
})