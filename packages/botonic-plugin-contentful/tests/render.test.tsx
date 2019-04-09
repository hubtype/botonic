import { Renderer } from "../src/render/render";
import { RichMessage, Button } from "../src/cms/model";

test("TEST: contentful", () => {
  let sut = new Renderer();
  let msg = new RichMessage();
  msg.title = "my title";
  msg.subtitle = "my subtitle";
  msg.button = new Button();
  msg.button.text = "my button";
  msg.button.payload = "my payload";
  msg.imgURL = "http://..jpg";

  // act
  let render = sut.richMessage(msg);

  // let rm = await c.richMessage("65SHlSs0paCgFrk93XzCxg", "payload");
  // expect(rm.title).toBe("Altres tràmits");
});
