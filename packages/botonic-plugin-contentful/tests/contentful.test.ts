import { Contentful } from "../src/contentful/contentful";
import { CallbackMap, Callback } from "../src/cms/cms";
import { mock } from "ts-mockito";



test("TEST: contentful", async () => {
  
  // // Massimo
  // this.client = c.login(
  //   '92w5st1ik4od',
  //   '531e998080a22a1da8cca3d3642a4628f0c19053e0a5244815c9a10b5b3781c4'
  // );

  // SantCugat
  let c = new Contentful(
    "u5utof016sy1",
    "09ad9c1ef3f1fb3b4c4e330d13dff04f1666fcd1b4cde5ee607f3ca993ef574d"
  );

  // act
  let callback = mock(Callback);
  let rm = await c.richMessage("65SHlSs0paCgFrk93XzCxg", CallbackMap.forAllIds(callback));
  
  // assert
  expect(rm.title).toBe("Altres tràmits");
  expect(rm.subtitle).toBeNull();
  expect(rm.imgUrl).toBe(
    "https://www.thelinda.org/wp-content/uploads/2018/02/Big-L-2-1.jpg"
  );
  expect(rm.buttons).toHaveLength(1);
  expect(rm.buttons[0].callback).toBe(callback);
  expect(rm.buttons[0].text).toBe("Ves-hi");
});
