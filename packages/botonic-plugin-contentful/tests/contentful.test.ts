import { Contentful } from "../src/contentful/contentful";

test("TEST: contentful", async () => {
  let c = new Contentful();
  // // Massimo
  // this.client = c.login(
  //   '92w5st1ik4od',
  //   '531e998080a22a1da8cca3d3642a4628f0c19053e0a5244815c9a10b5b3781c4'
  // );

  // SantCugat
  c.login(
    "u5utof016sy1",
    "09ad9c1ef3f1fb3b4c4e330d13dff04f1666fcd1b4cde5ee607f3ca993ef574d"
  );

  let rm = await c.richMessage("65SHlSs0paCgFrk93XzCxg", "payload");
  expect(rm.title).toBe("Altres tràmits");
  expect(rm.subtitle).toBeNull();
  expect(rm.imgURL).toBe(
    "https://www.thelinda.org/wp-content/uploads/2018/02/Big-L-2-1.jpg"
  );
  expect(rm.button.payload).toBe("payload");
  expect(rm.button.text).toBe("Ves-hi");
});
